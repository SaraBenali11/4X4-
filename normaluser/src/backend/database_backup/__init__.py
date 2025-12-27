"""
Database package initializer

Expose the ORM objects so other modules can import them as:
    from database import db, Product
"""
from .models import db, Product  # noqa: F401
