import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client

def list_products():
    """List all products from Supabase"""
    try:
        supabase = get_supabase_client()
        # Fetch products and related data
        response = supabase.table('products').select('*, categories(*), product_images(*)').order('created_at', desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error listing products: {e}")
        return []

def list_categories():
    """List all categories"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('categories').select('*').execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error listing categories: {e}")
        return []

def get_product(product_id):
    """Get a single product by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('products').select('*, categories(*), product_images(*), product_sizes(*), product_colors(*)').eq('id', product_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error getting product {product_id}: {e}")
        return None

def add_product(payload):
    """Create a new product"""
    try:
        supabase = get_supabase_client()
        
        # 1. Insert into products table
        product_data = {
            'name': payload.get('name'),
            'price': payload.get('price'),
            'description': payload.get('description', ''),
            'status': payload.get('status', 'new'),
            'category_id': payload.get('category_id'),
            'promo_price': payload.get('promo_price')
        }
        
        response = supabase.table('products').insert(product_data).execute()
        if not response.data:
            return None
        
        new_product = response.data[0]
        product_id = new_product['id']
        
        # 2. Handle Image (Single URL for now)
        if payload.get('image'):
             supabase.table('product_images').insert({'product_id': product_id, 'image_url': payload.get('image')}).execute()

        # 3. Handle Sizes
        if payload.get('sizes'):
             sizes = [s.strip() for s in payload.get('sizes').split(',') if s.strip()]
             if sizes:
                 supabase.table('product_sizes').insert([{'product_id': product_id, 'size': s} for s in sizes]).execute()

        # 4. Handle Colors
        if payload.get('colors'):
             colors = [c.strip() for c in payload.get('colors').split(',') if c.strip()]
             if colors:
                 supabase.table('product_colors').insert([{'product_id': product_id, 'color': c} for c in colors]).execute()
                 
        return new_product
    except Exception as e:
        print(f"Error adding product: {e}")
        # In a real app, you might want to rollback here or handle partial failures
        raise e

def delete_product(product_id):
    """Delete a product"""
    try:
        supabase = get_supabase_client()
        
        # Manually cascade delete related records
        supabase.table('product_images').delete().eq('product_id', product_id).execute()
        supabase.table('product_sizes').delete().eq('product_id', product_id).execute()
        supabase.table('product_colors').delete().eq('product_id', product_id).execute()
        
        # Delete related outfit items if any (optional safe-guard)
        supabase.table('outfit_products').delete().eq('product_id', product_id).execute()

        # Delete the product
        response = supabase.table('products').delete().eq('id', product_id).execute()
        
        if response.data:
            return True, "Product deleted successfully"
        else:
             # If no data returned, it might check count (supa-py behavior varies)
             # But if no exception raised, it's usually OK or ID not found.
             return True, "Product deleted (or not found)"
             
    except Exception as e:
        print(f"Error deleting product: {e}")
        return False, str(e)

def update_product(product_id, updates):
    """Update a product"""
    try:
        supabase = get_supabase_client()
        
        # Update main fields
        valid_fields = ['name', 'price', 'description', 'status', 'promo_price', 'category_id']
        clean_updates = {k: v for k, v in updates.items() if k in valid_fields}
        
        if clean_updates:
            supabase.table('products').update(clean_updates).eq('id', product_id).execute()
            
        # Update Relations (Simpler to delete and re-create for this scale)
        
        # Image
        if 'image' in updates:
             # Delete old images
             supabase.table('product_images').delete().eq('product_id', product_id).execute()
             # Insert new
             if updates['image']:
                supabase.table('product_images').insert({'product_id': product_id, 'image_url': updates['image']}).execute()
        
        # Sizes
        if 'sizes' in updates:
             supabase.table('product_sizes').delete().eq('product_id', product_id).execute()
             sizes = [s.strip() for s in updates['sizes'].split(',') if s.strip()]
             if sizes:
                 supabase.table('product_sizes').insert([{'product_id': product_id, 'size': s} for s in sizes]).execute()

        # Colors
        if 'colors' in updates:
             supabase.table('product_colors').delete().eq('product_id', product_id).execute()
             colors = [c.strip() for c in updates['colors'].split(',') if c.strip()]
             if colors:
                 supabase.table('product_colors').insert([{'product_id': product_id, 'color': c} for c in colors]).execute()
                 
        return True # Return success indicator
    except Exception as e:
        print(f"Error updating product: {e}")
        return None

def upload_product_image(file):
    """Upload image to Supabase Storage"""
    try:
        supabase = get_supabase_client()
        bucket_name = 'product-images' 
        
        # Ensure filename is unique
        import uuid
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'jpg'
        file_path = f"{uuid.uuid4()}.{file_ext}"
        
        # Read file content
        file_content = file.read()
        
        # Upload
        # Note: If bucket doesn't exist, this throws an error.
        response = supabase.storage.from_(bucket_name).upload(file_path, file_content, {"content-type": file.content_type or "image/jpeg"})
        
        # Get Public URL
        # Supabase Python client might return a simple string or response object depending on version
        # But get_public_url typically returns the URL string.
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        return public_url
    except Exception as e:
        print(f"Error uploading image: {e}")
        return None
