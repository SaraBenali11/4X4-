# Flask Backend Server - Main entry point
# This file starts our Flask server and connects to MySQL database

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

# Use PyMySQL as SQLAlchemy driver
import pymysql
pymysql.install_as_MySQLdb()

# Load environment variables from .env file if it exists
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Enable CORS - Allows frontend to communicate with backend
CORS(app)

# MySQL Configuration
# These settings connect Flask to your MySQL database
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'sutraty')
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'  # Returns results as dictionaries

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') or (
    f"mysql+pymysql://{app.config['MYSQL_USER']}:{app.config['MYSQL_PASSWORD']}@{app.config['MYSQL_HOST']}/{app.config['MYSQL_DB']}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from database.models import db, Product
# Initialize ORM with the app
db.init_app(app)

# Admin endpoint token
ADMIN_API_TOKEN = os.getenv('ADMIN_API_TOKEN')

# Simple MySQL wrapper that returns a pymysql connection
class SimpleMySQL:
    def __init__(self, app):
        self.app = app

    @property
    def connection(self):
        config = self.app.config
        return pymysql.connect(
            host=config.get('MYSQL_HOST', 'localhost'),
            user=config.get('MYSQL_USER', 'root'),
            password=config.get('MYSQL_PASSWORD', ''),
            db=config.get('MYSQL_DB', 'sutraty'),
            cursorclass=pymysql.cursors.DictCursor,
            charset='utf8mb4'
        )

# still keep SimpleMySQL for compatibility in case some parts of the app use direct connections
mysql = SimpleMySQL(app)

# Global variable to track database connection status
db_connected = False

def init_db_tables():
    """Initialize database tables if they don't exist"""
    try:
        cursor = mysql.connection.cursor()
        
        # Create products table if it doesn't exist
        create_table_query = """
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            sizes TEXT,
            colors TEXT,
            images TEXT,
            is_new TINYINT DEFAULT 0,
            is_best_seller TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """
        # Keep raw SQL table creation for compatibility as fallback
        cursor.execute(create_table_query)
        mysql.connection.commit()
        cursor.close()
        return True
    except Exception as e:
        print(f"Error initializing database tables: {e}")
        return False

# Test route to check if server is running
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Flask backend server is running!', 'status': 'success'})

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Try a simple ORM query to verify DB connectivity
        with app.app_context():
            Product.query.first()
        return jsonify({
            'status': 'success',
            'message': 'Backend is healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Backend is running but database is not connected',
            'database': 'disconnected',
            'error': str(e)
        }), 500

# GET all products - Returns all products from database
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        # Use the ORM to fetch and serialize products
        products = Product.query.order_by(Product.created_at.desc()).all()
        products_list = [p.to_dict() for p in products]

        return jsonify({
            'status': 'success',
            'data': products_list,
            'count': len(products_list)
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Database error: {str(e)}',
            'data': [],
            'count': 0
        }), 500

# POST new product - Adds a new product to the database
@app.route('/api/products', methods=['POST'])
def add_product():
    try:
        # Using ORM to add product

        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'category', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400

        # Prepare data for insertion
        name = data['name']
        category = data['category']
        price = float(data['price'])
        sizes = ','.join(data.get('sizes', []))
        colors = ','.join(data.get('colors', []))
        images = ','.join(data.get('images', []))
        is_new = 1 if data.get('isNew', False) else 0
        is_best_seller = 1 if data.get('isBestSeller', False) else 0

        # Insert product using SQLAlchemy ORM
        new_product = Product(
            name=name,
            category=category,
            price=price,
            sizes=sizes,
            colors=colors,
            images=images,
            is_new=bool(is_new),
            is_best_seller=bool(is_best_seller)
        )
        db.session.add(new_product)
        db.session.commit()
        product_id = new_product.id

        # For persistent seed changes, use the admin seed editing endpoint.

        return jsonify({
            'status': 'success',
            'message': 'Product added successfully',
            'data': {'id': product_id}
        }), 201

    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        return jsonify({
            'status': 'error',
            'message': f'Database error: {str(e)}'
        }), 500

# GET single product by ID
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({
                'status': 'error',
                'message': 'Product not found'
            }), 404
        return jsonify({'status': 'success', 'data': product.to_dict()}), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# DELETE product by ID
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        # Use ORM
        prod = Product.query.get(product_id)
        if not prod:
            return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        db.session.delete(prod)
        db.session.commit()
        # Verify deletion
        still = Product.query.get(product_id)
        if still:
            # Something went wrong: roll back and report an error
            return jsonify({'status': 'error', 'message': 'Unable to confirm deletion'}), 500
        
        # Optionally remove product from seed files so future inits/fallbacks won't repopulate it
        # For persistent seed changes, use the admin seed editing endpoint.

        return jsonify({
            'status': 'success',
            'message': 'Product deleted successfully'
        }), 200
        
    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# UPDATE product by ID
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()

        # Use ORM to fetch and update the product
        prod = Product.query.get(product_id)
        if not prod:
            return jsonify({
                'status': 'error',
                'message': 'Product not found'
            }), 404

        # Store pre-update snapshot for seed file update
        old_name = prod.name
        old_id = prod.id

        # Apply only provided fields
        if 'name' in data:
            prod.name = data['name']
        if 'category' in data:
            prod.category = data['category']
        if 'price' in data:
            prod.price = float(data['price'])
        if 'sizes' in data:
            prod.sizes = ','.join(data['sizes'])
        if 'colors' in data:
            prod.colors = ','.join(data['colors'])
        if 'images' in data:
            prod.images = ','.join(data['images'])
        if 'isNew' in data:
            prod.is_new = bool(data['isNew'])
        if 'isBestSeller' in data:
            prod.is_best_seller = bool(data['isBestSeller'])

        # No valid fields to update
        if not data:
            return jsonify({ 'status': 'error', 'message': 'No fields to update' }), 400

        db.session.commit()
        # For persistent seed changes, use the admin seed editing endpoint.

        return jsonify({'status': 'success', 'message': 'Product updated successfully'}), 200
        
    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/admin/seed-edit', methods=['POST'])
def admin_seed_edit():
    """Admin-only endpoint to modify seed files.
    Requires ADMIN_API_TOKEN env var and header 'X-ADMIN-TOKEN' matching it.
    Request JSON format: { action: 'add'|'remove'|'update', target: 'py'|'js'|'both', payload: {...}, dry_run: true/false }
    """
    token = request.headers.get('X-ADMIN-TOKEN')
    if not ADMIN_API_TOKEN or token != ADMIN_API_TOKEN:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    body = request.get_json() or {}
    action = body.get('action')
    target = body.get('target', 'both')
    payload = body.get('payload', {})
    dry_run = bool(body.get('dry_run', True))

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    py_path = os.path.join(repo_root, 'src', 'backend', 'database', 'data.py')
    js_path = os.path.join(repo_root, 'src', 'database', 'data', 'adminData.js')

    try:
        from scripts.seed_updater import remove_from_py_seed, remove_from_js_seed, add_to_py_seed, add_to_js_seed
        results = {}
        if action == 'remove':
            if target in ('py', 'both'):
                results['py'] = remove_from_py_seed(py_path, name=payload.get('name'), id=payload.get('id'), dry_run=dry_run)
            if target in ('js', 'both'):
                results['js'] = remove_from_js_seed(js_path, name=payload.get('name'), id=payload.get('id'), dry_run=dry_run)
        elif action == 'add':
            if target in ('py', 'both'):
                results['py'] = add_to_py_seed(py_path, payload, dry_run=dry_run)
            if target in ('js', 'both'):
                results['js'] = add_to_js_seed(js_path, payload, dry_run=dry_run)
        elif action == 'update':
            # update = remove old + add new; payload must contain 'old' and 'new'
            old = payload.get('old', {})
            new = payload.get('new', {})
            if target in ('py', 'both'):
                remove_res = remove_from_py_seed(py_path, name=old.get('name'), id=old.get('id'), dry_run=dry_run)
                add_res = add_to_py_seed(py_path, new, dry_run=dry_run)
                results['py'] = (remove_res, add_res)
            if target in ('js', 'both'):
                remove_res = remove_from_js_seed(js_path, name=old.get('name'), id=old.get('id'), dry_run=dry_run)
                add_res = add_to_js_seed(js_path, new, dry_run=dry_run)
                results['js'] = (remove_res, add_res)
        else:
            return jsonify({'status': 'error', 'message': 'Invalid action'}), 400

        return jsonify({'status': 'success', 'results': results}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    # Initialize database tables
    print('Initializing database tables...')
    # Use SQLAlchemy based table creation & sample data seeding if available
    try:
        from database.datatables import create_tables
        # Honor SKIP_DB_SEED env variable or SKIP_DB_SEED in .env to avoid re-seeding on restarts
        # Default behavior: skip seeding by default to avoid accidental re-seed on restart.
        # Use SKIP_DB_SEED=false to allow seeding, or FORCE_DB_SEED=true to force seeding.
        env_skip_val = os.getenv('SKIP_DB_SEED')
        force_val = os.getenv('FORCE_DB_SEED')
        if force_val and force_val.lower() in ('1', 'true', 'yes'):
            skip_seed = False
        elif env_skip_val is None:
            skip_seed = True
        else:
            skip_seed = env_skip_val.lower() in ('1', 'true', 'yes')
        create_tables(app, seed=not skip_seed)
        print('Tables created using SQLAlchemy.')
    except Exception as e:
        print(f'Could not initialize using SQLAlchemy: {e}')
        print('Falling back to raw SQL connection initialization...')
        init_db_tables()
    
    # Start the server
    print('Starting Flask server...')
    print('API available at http://localhost:5000/api/products')
    print('Health check at http://localhost:5000/api/health')
    print('Note: Make sure MySQL is running for full functionality')
    app.run(debug=True, host='0.0.0.0', port=5000)
