from flask import Blueprint, jsonify, request
from services.product_service import (
    list_products,
    get_product,
    create_product,
    remove_product,
    update_product,
    list_categories,
)

bp = Blueprint('products', __name__)

@bp.route('/categories', methods=['GET'])
def categories_list():
    try:
        categories = list_categories()
        return jsonify({'status': 'success', 'data': categories}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products', methods=['GET'])
def products_list():
    try:
        products = list_products()
        return jsonify({'status': 'success', 'data': products, 'count': len(products)}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e), 'data': [], 'count': 0}), 500


@bp.route('/products', methods=['POST'])
def products_create():
    try:
        data = request.get_json() or {}
        new_p = create_product(data)
        return jsonify({'status': 'success', 'message': 'Product added successfully', 'data': new_p}), 201
    except ValueError as ve:
        return jsonify({'status': 'error', 'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products/<string:product_id>', methods=['GET'])
def products_get(product_id):
    try:
        p = get_product(product_id)
        if not p:
            return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        return jsonify({'status': 'success', 'data': p}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products/<string:product_id>', methods=['DELETE'])
def products_delete(product_id):
    try:
        success, message = remove_product(product_id)
        if not success:
            return jsonify({'status': 'error', 'message': message}), 400
        return jsonify({'status': 'success', 'message': message}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products/<string:product_id>', methods=['PUT'])
def products_update(product_id):
    try:
        data = request.get_json() or {}
        if not data:
            return jsonify({'status': 'error', 'message': 'No fields to update'}), 400
        updated = update_product(product_id, data)
        if not updated:
            return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        return jsonify({'status': 'success', 'message': 'Product updated successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'status': 'error', 'message': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'status': 'error', 'message': 'No selected file'}), 400
            
        from services.product_service import upload_product_image
        public_url = upload_product_image(file)
        
        if public_url:
             return jsonify({'status': 'success', 'url': public_url}), 200
        else:
             return jsonify({'status': 'error', 'message': 'Upload failed'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
