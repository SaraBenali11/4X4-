"""
Simple helper script to print Flask routes from app.py
Run from `src/backend` with `python check_routes.py`
Requires Python and backend dependencies installed.
"""

import sys
import os

# Ensure backend folder is discoverable
sys.path.insert(0, os.getcwd())

try:
    from app import app
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    print("Detected routes:")
    for r in routes:
        print(r)
except Exception as e:
    print("Error loading Flask app:", e)
    print("Make sure you have Python installed and backend dependencies installed (pip install -r requirements.txt)")
