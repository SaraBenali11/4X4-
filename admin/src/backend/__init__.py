"""Backend package initializer

This package uses an MVC + layered layout. Keep `app.py` as the lightweight
Flask application entry point; move route handlers into `controllers/`, business
logic into `services/`, and DB access into `repositories/`.

Purpose: make the backend easier to navigate by grouping responsibilities.
"""

__all__ = [
    'controllers',
    'services',
    'repositories',
]
