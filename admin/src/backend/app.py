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

# Ensure `src` and `src/backend` are on sys.path so imports like
# `from database.models import ...` and `import controllers.products` work
import sys
# Ensure project src root is on path (../)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# Ensure backend folder is on path for `controllers.*` imports
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

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
        # Try a simple ORM query to verify DB connectivity (optional - MySQL)
        mysql_connected = False
        try:
            with app.app_context():
                Product.query.first()
            mysql_connected = True
        except:
            mysql_connected = False
        
        # Test Supabase connection (for admin)
        supabase_connected = False
        try:
            from config.supabase_config import get_supabase_client
            supabase = get_supabase_client()
            supabase.table('admins').select('id').limit(1).execute()
            supabase_connected = True
        except:
            supabase_connected = False
        
        return jsonify({
            'status': 'success',
            'message': 'Backend is healthy',
            'mysql': 'connected' if mysql_connected else 'disconnected (optional)',
            'supabase': 'connected' if supabase_connected else 'disconnected',
            'admin_auth': 'available' if supabase_connected else 'unavailable'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'success',
            'message': 'Backend is running',
            'mysql': 'disconnected (optional)',
            'supabase': 'checking...',
            'note': 'Admin login uses Supabase, MySQL is optional for products'
        }), 200
# Product routes are provided by the products blueprint (controllers)
from controllers.products import bp as products_bp
app.register_blueprint(products_bp, url_prefix='/api')

# Admin routes moved to their own controller to keep this file concise
from controllers.admin import bp as admin_bp
app.register_blueprint(admin_bp, url_prefix='/api')

from controllers.outfits import bp as outfits_bp
app.register_blueprint(outfits_bp, url_prefix='/api')

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
