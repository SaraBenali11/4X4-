import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client

def list_products():
    """List all products from Supabase"""
    try:
        supabase = get_supabase_client()
        # Fetch products
        response = supabase.table('products').select('*').order('created_at', desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error listing products: {e}")
        return []

def get_product(product_id):
    """Get a single product by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('products').select('*').eq('id', product_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error getting product {product_id}: {e}")
        return None

def add_product(payload):
    """Create a new product - Simplified for schema compatibility"""
    try:
        supabase = get_supabase_client()
        
        # Basic mapping to new schema
        # Note: We are not handling category_id lookup or related tables (sizes/colors) 
        # extensively here as it requires further backend migration.
        # This is a best-effort insert to keep the API functional.
        product_data = {
            'name': payload.get('name'),
            'price': payload.get('price'),
            'description': payload.get('description', ''),
            'status': 'new'
        }
        
        response = supabase.table('products').insert(product_data).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error adding product: {e}")
        raise e

def delete_product(product_id):
    """Delete a product"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('products').delete().eq('id', product_id).execute()
        # Supabase delete returns the deleted rows. If list is not empty, it succeeded.
        return len(response.data) > 0 if response.data else True 
    except Exception as e:
        print(f"Error deleting product: {e}")
        return False

def update_product(product_id, updates):
    """Update a product"""
    try:
        supabase = get_supabase_client()
        
        # Map updates to schema fields
        valid_fields = ['name', 'price', 'description', 'status', 'promo_price']
        clean_updates = {k: v for k, v in updates.items() if k in valid_fields}
        
        if not clean_updates:
            return None
            
        response = supabase.table('products').update(clean_updates).eq('id', product_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error updating product: {e}")
        return None
