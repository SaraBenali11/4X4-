from database.models import Product, db


def list_products():
    return Product.query.order_by(Product.created_at.desc()).all()


def get_product(product_id):
    return Product.query.get(product_id)


def add_product(payload):
    p = Product(
        name=payload['name'],
        category=payload['category'],
        price=payload['price'],
        sizes=payload.get('sizes', ''),
        colors=payload.get('colors', ''),
        images=payload.get('images', ''),
        is_new=bool(payload.get('isNew', False)),
        is_best_seller=bool(payload.get('isBestSeller', False)),
    )
    db.session.add(p)
    db.session.commit()
    return p


def delete_product(product_id):
    p = Product.query.get(product_id)
    if not p:
        return False
    db.session.delete(p)
    db.session.commit()
    return True


def update_product(product_id, updates):
    p = Product.query.get(product_id)
    if not p:
        return None
    for k, v in updates.items():
        if k == 'sizes' or k == 'colors' or k == 'images':
            setattr(p, k, ','.join(v) if isinstance(v, (list, tuple)) else v)
        elif k == 'price':
            setattr(p, k, float(v))
        elif k == 'isNew':
            p.is_new = bool(v)
        elif k == 'isBestSeller':
            p.is_best_seller = bool(v)
        else:
            setattr(p, k, v)
    db.session.commit()
    return p
