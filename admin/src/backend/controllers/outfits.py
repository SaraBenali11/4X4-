from flask import Blueprint, jsonify, request
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client

bp = Blueprint('outfits', __name__)

@bp.route('/outfits', methods=['GET'])
def get_outfits():
    """Get all outfits with product details"""
    try:
        supabase = get_supabase_client()
        
        # 1. Fetch all outfits
        response = supabase.table('outfits').select('*').order('created_at', desc=True).execute()
        outfits = response.data
        
        if not outfits:
            return jsonify({'success': True, 'data': []}), 200

        # 2. Fetch all outfit_products to link products
        op_response = supabase.table('outfit_products').select('outfit_id, product_id').execute()
        outfit_products_map = {}
        for op in op_response.data:
            oid = op['outfit_id']
            pid = op['product_id']
            if oid not in outfit_products_map:
                outfit_products_map[oid] = []
            outfit_products_map[oid].append(pid)

        # 3. Fetch products details for these IDs (Optional optimization: fetch all needed products in one go)
        # For simplicity, we might just fetch all products or do individual lookups. 
        # Better: Let's fetch all products that are referenced.
        all_product_ids = [pid for pids in outfit_products_map.values() for pid in pids]
        
        products_map = {}
        if all_product_ids:
            # Supabase 'in' query
            # Note: Supabase-py syntax might be slightly different depending on version, usually .in_('id', list)
            p_response = supabase.table('products').select('*').in_('id', all_product_ids).execute()
            for p in p_response.data:
                products_map[p['id']] = p

        # 4. Assemble the response
        result = []
        for outfit in outfits:
            outfit_id = outfit['id']
            product_ids = outfit_products_map.get(outfit_id, [])
            products = [products_map[pid] for pid in product_ids if pid in products_map]
            
            outfit_data = {
                **outfit,
                'products': products
            }
            result.append(outfit_data)

        return jsonify({'success': True, 'data': result}), 200

    except Exception as e:
        print(f"Error fetching outfits: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/outfits/<outfit_id>', methods=['GET'])
def get_outfit(outfit_id):
    """Get single outfit"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('outfits').select('*').eq('id', outfit_id).execute()
        
        if not response.data:
            return jsonify({'success': False, 'error': 'Outfit not found'}), 404
            
        outfit = response.data[0]
        
        # Get products
        op_response = supabase.table('outfit_products').select('product_id').eq('outfit_id', outfit_id).execute()
        product_ids = [item['product_id'] for item in op_response.data]
        
        products = []
        if product_ids:
            p_response = supabase.table('products').select('*').in_('id', product_ids).execute()
            products = p_response.data
            
        outfit['products'] = products
        
        return jsonify({'success': True, 'data': outfit}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/outfits', methods=['POST'])
def create_outfit():
    """Create a new outfit"""
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        product_ids = data.get('product_ids', []) # List of UUIDs
        created_by = data.get('created_by') # Admin ID

        if not title:
            return jsonify({'success': False, 'error': 'Title is required'}), 400

        supabase = get_supabase_client()

        # 1. Insert Outfit
        outfit_payload = {
            'title': title,
            'description': description,
            'created_by': created_by
        }
        outfit_res = supabase.table('outfits').insert(outfit_payload).execute()
        
        if not outfit_res.data:
             return jsonify({'success': False, 'error': 'Failed to create outfit record'}), 500
             
        new_outfit = outfit_res.data[0]
        new_outfit_id = new_outfit['id']

        # 2. Insert Outfit Products
        if product_ids:
            op_payload = [{'outfit_id': new_outfit_id, 'product_id': pid} for pid in product_ids]
            supabase.table('outfit_products').insert(op_payload).execute()

        return jsonify({'success': True, 'data': new_outfit}), 201

    except Exception as e:
        print(f"Error creating outfit: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/outfits/<outfit_id>', methods=['PUT'])
def update_outfit(outfit_id):
    """Update an outfit"""
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        product_ids = data.get('product_ids') # Optional list of UUIDs to REPLACE existing

        supabase = get_supabase_client()

        # 1. Update Outfit details
        update_payload = {}
        if title: update_payload['title'] = title
        if description is not None: update_payload['description'] = description
        
        if update_payload:
            supabase.table('outfits').update(update_payload).eq('id', outfit_id).execute()

        # 2. Update Products if provided
        if product_ids is not None:
            # Strategy: Delete all existing links and add new ones (simple & effective for association tables)
            supabase.table('outfit_products').delete().eq('outfit_id', outfit_id).execute()
            
            if product_ids:
                 op_payload = [{'outfit_id': outfit_id, 'product_id': pid} for pid in product_ids]
                 supabase.table('outfit_products').insert(op_payload).execute()

        return jsonify({'success': True, 'message': 'Outfit updated successfully'}), 200

    except Exception as e:
        print(f"Error updating outfit: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/outfits/<outfit_id>', methods=['DELETE'])
def delete_outfit(outfit_id):
    """Delete an outfit"""
    try:
        supabase = get_supabase_client()
        
        # Cascade delete should handle outfit_products if configured in DB.
        # But to be safe/explicit or if cascade isn't set:
        # supabase.table('outfit_products').delete().eq('outfit_id', outfit_id).execute()
        
        response = supabase.table('outfits').delete().eq('id', outfit_id).execute()
        
        return jsonify({'success': True, 'message': 'Outfit deleted'}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
