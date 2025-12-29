from repositories.product_repository import (
    list_products as repo_list,
    get_product as repo_get,
    add_product as repo_add,
    delete_product as repo_delete,
    update_product as repo_update,
    list_categories as repo_list_categories,
    upload_product_image as repo_upload_image,
)


def list_products():
    products = repo_list()
    return products


def get_product(product_id):
    p = repo_get(product_id)
    return p if p else None


def list_categories():
    return repo_list_categories()


def create_product(data):
    # Ensure lists are strings if coming from JSON as lists, 
    # though frontend form data usually sends strings.
    # The repository expects strings for splitting.
    if isinstance(data.get('sizes'), list):
        data['sizes'] = ','.join(data['sizes'])
    if isinstance(data.get('colors'), list):
        data['colors'] = ','.join(data['colors'])
    
    p = repo_add(data)
    return p if p else {}


def remove_product(product_id):
    return repo_delete(product_id)


def update_product(product_id, updates):
    if isinstance(updates.get('sizes'), list):
        updates['sizes'] = ','.join(updates['sizes'])
    if isinstance(updates.get('colors'), list):
        updates['colors'] = ','.join(updates['colors'])

    p = repo_update(product_id, updates)
    return p if p else None


def upload_product_image(file):
    return repo_upload_image(file)
