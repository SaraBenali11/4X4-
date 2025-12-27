from .models import db, Product
from .data import sample_products


def create_tables(app):
    """Initialize database tables using SQLAlchemy and optionally seed sample data.
    `app` should be a Flask app configured with SQLALCHEMY settings.
    """
    db.init_app(app)
    with app.app_context():
        db.create_all()

        # Insert sample data only if products table is empty
        if Product.query.count() == 0:
            for p in sample_products:
                prod = Product(
                    name=p['name'],
                    category=p['category'],
                    price=p['price'],
                    sizes=','.join(p.get('sizes', [])),
                    colors=','.join(p.get('colors', [])),
                    images=','.join(p.get('images', [])),
                    is_new=bool(p.get('isNew', False)),
                    is_best_seller=bool(p.get('isBestSeller', False)),
                )
                db.session.add(prod)
            db.session.commit()
