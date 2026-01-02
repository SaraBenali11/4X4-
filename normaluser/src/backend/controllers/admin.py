from flask import Blueprint, jsonify, request
import os

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
