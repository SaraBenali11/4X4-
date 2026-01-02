"""
Database models for the application.
This file defines SQLAlchemy models that can be used across the application.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Create SQLAlchemy instance
db = SQLAlchemy()


class Product(db.Model):
    """Product model for the database"""
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    sizes = db.Column(db.Text, nullable=True)  # comma-separated
    colors = db.Column(db.Text, nullable=True)  # comma-separated
    images = db.Column(db.Text, nullable=True)  # comma-separated URLs
    is_new = db.Column(db.Boolean, default=False)
    is_best_seller = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert product to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': float(self.price),
            'sizes': self.sizes.split(',') if self.sizes else [],
            'colors': self.colors.split(',') if self.colors else [],
            'images': self.images.split(',') if self.images else [],
            'isNew': bool(self.is_new),
            'isBestSeller': bool(self.is_best_seller),
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
