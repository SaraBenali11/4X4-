"""
Database package for shared database models and seed data.
This package lives at `src/database` so backend modules can import it as
`from database import ...` when `src` is on PYTHONPATH (the app adds it at runtime).
"""
from .models import db, Product  # noqa: F401
