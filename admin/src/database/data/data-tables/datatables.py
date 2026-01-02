import os
from .models.models import db, Product
from .data.dummycheck.data import sample_products


def create_tables(app, seed=True):
    """Initialize database tables using SQLAlchemy and optionally seed sample data.
    `app` should be a Flask app configured with SQLALCHEMY settings. The app must
    already have invoked `db.init_app(app)` to avoid re-registering the SQLAlchemy
    instance.
    """
    with app.app_context():
        db.create_all()
        # Decide if seeding is enabled. The `seed` argument can override environment.
        skip_seed_env = os.getenv('SKIP_DB_SEED', 'false').lower() in ('1', 'true', 'yes')
        do_seed = seed and not skip_seed_env

        # Insert sample data only if products table is empty AND seeding is enabled
        if do_seed and Product.query.count() == 0:
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
