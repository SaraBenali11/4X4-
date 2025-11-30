import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ProductDetail.css';

// ProductDetail Component
const ProductDetail = ({ product, onBack }) => {
  // Initialize state with safe defaults so hooks are always called in order
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? '');

  // Fallback for missing product (prevents runtime errors when mounted without props)
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="detail-container">
          <button className="back-button" onClick={onBack || (() => window.history.back())}>
            ← Retour
          </button>
          <div className="detail-content">
            <p>Produit non disponible. Veuillez revenir en arrière.</p>
          </div>
        </div>
      </div>
    );
  }

  // Note: selectedSize and selectedColor are already initialized above (hooks must run first)

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <button className="back-button" onClick={onBack}>
          ← Retour
        </button>

        <div className="detail-content">
          {/* Left Side - Image */}
          <div className="detail-left">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-container">
              <div className="thumbnail active">
                <img src={product.image} alt={product.name} />
              </div>
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="detail-right">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-price">{product.price} DA</p>

            <div className="detail-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="detail-section">
              <h3>Taille</h3>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Couleur</h3>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Caractéristiques</h3>
              <ul className="features-list">
                {product.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Disponible dans nos boutiques</h3>
              <div className="availability-list">
                {product.availability.map((location, idx) => (
                  <div key={idx} className="availability-item">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{location}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary">Sélectionnez une taille</button>

            <div className="button-group">
              <button className="btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Favori
              </button>
              <button className="btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Partager
              </button>
            </div>

            <p className="note">
              <strong>Note:</strong> Après avoir soumis votre commande, notre équipe vous contactera
              pour confirmer les détails et organiser la livraison.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductDetail.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    availability: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ProductDetail;
