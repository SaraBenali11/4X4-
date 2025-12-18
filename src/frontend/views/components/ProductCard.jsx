import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/ProductCard.css";
import { formatPrice } from "../../utils/formatters";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";

/**
 * Product card component
 * Displays product information with image, name, category, and pricing
 */
function ProductCard({
  image,
  name,
  category,
  price,
  oldPrice = null,
  isNew = false,
  productId,
  onClick,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite: toggleFav } =
    useContext(FavoritesContext);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const favorited = isFavorite(productId);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    toggleFav({
      productId,
      name,
      category,
      price,
      image,
      oldPrice,
      isNew,
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setShowSizeModal(true);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    addToCart({
      productId,
      name,
      category,
      price,
      image,
      size,
      quantity: 1,
    });
    setShowSizeModal(false);
    setSelectedSize(null);
  };

  return (
    <>
      <article
        className="pcard"
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleCardClick()
        }
      >
        <div className="pcard-image">
          {isNew && <span className="pcard-badge">Nouveau</span>}
          <img src={image} alt={name} loading="lazy" />
          <button
            className="pcard-fav"
            onClick={toggleFavorite}
            aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            {favorited ? "♥" : "♡"}
          </button>
        </div>

        <div className="pcard-body">
          <h3 className="pcard-title">{name}</h3>
          <p className="pcard-cat">{category}</p>

          <div className="pcard-price">
            <span className="current">{formatPrice(price)}</span>
            {oldPrice && <span className="old">{formatPrice(oldPrice)}</span>}
          </div>

          <button
            className="pcard-add-to-cart"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            Ajouter au panier
          </button>
        </div>
      </article>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div
          className="size-modal-overlay"
          onClick={() => setShowSizeModal(false)}
        >
          <div className="size-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sélectionnez une taille</h3>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="size-modal-close"
              onClick={() => setShowSizeModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
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
