"""
Seed data for backend database (products used in admin sample)
This mirrors the frontend sample data schema.
"""

sample_products = [
    {
        'name': 'Abaya Élégante Beige',
        'category': 'Abaya',
        'price': 8500,
        'sizes': ['S', 'M', 'L'],
        'colors': ['Beige', 'Noir'],
        'images': [],
        'isNew': True,
        'isBestSeller': False,
    },
    {
        'name': 'Robe Longue Crème',
        'category': 'Robes',
        'price': 6500,
        'sizes': ['S', 'M', 'L'],
        'colors': ['Crème'],
        'images': [],
        'isNew': True,
        'isBestSeller': False,
    },
    {
        'name': 'Ensemble Chic Nude',
        'category': 'Ensembles',
        'price': 7200,
        'sizes': ['S', 'M', 'L'],
        'colors': ['Nude'],
        'images': [],
        'isNew': False,
        'isBestSeller': True,
    },
]
