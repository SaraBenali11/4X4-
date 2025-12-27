from ..repositories.product_repository import (
    list_products as repo_list,
    get_product as repo_get,
    add_product as repo_add,
    delete_product as repo_delete,
    update_product as repo_update,
)


def list_products():
    products = repo_list()
    return [p.to_dict() for p in products]


def get_product(product_id):
    p = repo_get(product_id)
    return p.to_dict() if p else None


def create_product(data):
    # Basic validation
    required = ('name', 'category', 'price')
    for f in required:
        if f not in data:
            raise ValueError(f'Missing required field: {f}')
    # Normalize list fields
    data['sizes'] = ','.join(data.get('sizes', [])) if isinstance(data.get('sizes', []), (list, tuple)) else data.get('sizes', '')
    data['colors'] = ','.join(data.get('colors', [])) if isinstance(data.get('colors', []), (list, tuple)) else data.get('colors', '')
    data['images'] = ','.join(data.get('images', [])) if isinstance(data.get('images', []), (list, tuple)) else data.get('images', '')
    p = repo_add(data)
    return p.to_dict()


def remove_product(product_id):
    return repo_delete(product_id)


def update_product(product_id, updates):
    p = repo_update(product_id, updates)
    return p.to_dict() if p else None
