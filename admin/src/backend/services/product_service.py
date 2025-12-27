from repositories.product_repository import (
    list_products as repo_list,
    get_product as repo_get,
    add_product as repo_add,
    delete_product as repo_delete,
    update_product as repo_update,
)


def list_products():
    products = repo_list()
    # Repository now returns list of dicts (Supabase data), so no need for to_dict()
    return products



def get_product(product_id):
    p = repo_get(product_id)
    return p if p else None


def create_product(data):
    # Basic validation
    required = ('name', 'category', 'price') # Note: Check keys match what frontend sends
    # If frontend sends 'category' but we need 'category_id', this might fail or we need to relax
    # For now, let's allow it to pass through and let the repo handle (or fail)
    
    # Normalize list fields (if present in data, though repo might not use them fully yet)
    data['sizes'] = ','.join(data.get('sizes', [])) if isinstance(data.get('sizes', []), (list, tuple)) else data.get('sizes', '')
    data['colors'] = ','.join(data.get('colors', [])) if isinstance(data.get('colors', []), (list, tuple)) else data.get('colors', '')
    data['images'] = ','.join(data.get('images', [])) if isinstance(data.get('images', []), (list, tuple)) else data.get('images', '')
    
    p = repo_add(data)
    # Support 'to_dict' just in case p is still an object? No, repo_add returns dict or None.
    return p if p else {}


def remove_product(product_id):
    return repo_delete(product_id)


def update_product(product_id, updates):
    p = repo_update(product_id, updates)
    return p if p else None
