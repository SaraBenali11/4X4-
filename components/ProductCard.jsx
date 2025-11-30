import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/ProductCard.css';
import { formatPrice } from '../../utils/formatters';

/**
 * Product card component
 * Displays product information with image, name, category, and pricing
 */
function ProductCard({ image, name, category, price, oldPrice = null, isNew = false, productId, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking favorite button
    setIsFavorite((prev) => !prev);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <article
      className="pcard"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      <div className="pcard-image">
        {isNew && <span className="pcard-badge">Nouveau</span>}
        <img src={image} alt={name} loading="lazy" />
        <button
          className="pcard-fav"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="pcard-body">
        <h3 className="pcard-title">{name}</h3>
        <p className="pcard-cat">{category}</p>

        <div className="pcard-price">
          <span className="current">{formatPrice(price)}</span>
          {oldPrice && <span className="old">{formatPrice(oldPrice)}</span>}
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  oldPrice: PropTypes.number,
  isNew: PropTypes.bool,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};

export default ProductCard;