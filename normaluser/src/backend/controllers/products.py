from flask import Blueprint, jsonify, request
from ..services.product_service import (
    list_products,
    get_product,
    create_product,
    remove_product,
    update_product,
)

bp = Blueprint('products', __name__)


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


@bp.route('/products/<int:product_id>', methods=['GET'])
def products_get(product_id):
    try:
        p = get_product(product_id)
        if not p:
            return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        return jsonify({'status': 'success', 'data': p}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products/<int:product_id>', methods=['DELETE'])
def products_delete(product_id):
    try:
        ok = remove_product(product_id)
        if not ok:
            return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        return jsonify({'status': 'success', 'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@bp.route('/products/<int:product_id>', methods=['PUT'])
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
