from flask import Blueprint, jsonify, request
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client
from utils.password_utils import verify_password, hash_password

bp = Blueprint('admin', __name__)


@bp.route('/admin/seed-edit', methods=['POST'])
def admin_seed_edit():
    """Admin endpoint to edit seed data used by the app.

    This was moved out of `app.py` so the main file stays compact. The
    endpoint requires the `X-ADMIN-TOKEN` header matching the
    `ADMIN_API_TOKEN` environment variable.
    """
    ADMIN_API_TOKEN = os.getenv('ADMIN_API_TOKEN')
    token = request.headers.get('X-ADMIN-TOKEN')
    if not ADMIN_API_TOKEN or token != ADMIN_API_TOKEN:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    body = request.get_json() or {}
    action = body.get('action')
    target = body.get('target', 'both')
    payload = body.get('payload', {})
    dry_run = bool(body.get('dry_run', True))

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    py_path = os.path.join(repo_root, 'src', 'database', 'data.py')
    js_path = os.path.join(repo_root, 'src', 'database', 'data', 'adminData.js')

    try:
        # keep the existing seed_updater utilities (they live in backend scripts)
        from scripts.seed_updater import (
            remove_from_py_seed,
            remove_from_js_seed,
            add_to_py_seed,
            add_to_js_seed,
        )

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


@bp.route('/admin/verify-password', methods=['POST'])
def verify_admin_password():
    """Verify admin password against hash"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        password_hash = data.get('password_hash')

        if not email or not password or not password_hash:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Verify password
        is_valid = verify_password(password, password_hash)
        
        if is_valid:
            return jsonify({'success': True}), 200
        else:
            return jsonify({'success': False, 'error': 'Invalid password'}), 401
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/admin/profile/<admin_id>', methods=['GET'])
def get_admin_profile(admin_id):
    """Get admin profile"""
    try:
        supabase = get_supabase_client()
        
        # Get admin from Supabase
        response = supabase.table('admins').select('id, email, name, phone, address, created_at').eq('id', admin_id).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({'success': False, 'error': 'Admin not found'}), 404
        
        admin = response.data[0]
        
        return jsonify({
            'success': True,
            'data': admin
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/admin/profile/<admin_id>', methods=['PUT'])
def update_admin_profile(admin_id):
    """Update admin profile"""
    try:
        data = request.get_json()
        supabase = get_supabase_client()
        
        # Prepare update data (only include fields that are provided)
        update_data = {}
        
        if 'name' in data:
            update_data['name'] = data['name']
        if 'email' in data:
            update_data['email'] = data['email']
        if 'phone' in data:
            update_data['phone'] = data['phone']
        if 'address' in data:
            update_data['address'] = data['address']
        if 'password' in data and data['password']:
            # Hash new password if provided
            update_data['password_hash'] = hash_password(data['password'])
        
        if not update_data:
            return jsonify({'success': False, 'error': 'No fields to update'}), 400
        
        # Update admin in Supabase
        response = supabase.table('admins').update(update_data).eq('id', admin_id).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({'success': False, 'error': 'Admin not found'}), 404
        
        admin = response.data[0]
        
        # Remove password_hash from response
        admin.pop('password_hash', None)
        
        return jsonify({
            'success': True,
            'data': admin
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
