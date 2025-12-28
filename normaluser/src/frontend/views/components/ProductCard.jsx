import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/ProductCard.css";
import { formatPrice } from "../../utils/formatters";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";

// Color mapping for visual display
const colorMap = {
  Noir: "#000000",
  Blanc: "#FFFFFF",
  Gris: "#808080",
  Beige: "#F5F5DC",
  Bleu: "#4169E1",
  Rouge: "#DC143C",
  Vert: "#228B22",
  Jaune: "#FFD700",
  Rose: "#FFB6C1",
  Marron: "#8B4513",
  Orange: "#FF8C00",
  Violet: "#8B008B",
};

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
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite: toggleFav } =
    useContext(FavoritesContext);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Noir", "Blanc", "Gris", "Beige", "Bleu", "Rouge"];
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
    setSelectedSize(null);
    setSelectedColor(null);
    setError("");
  };

  const handleConfirmSelection = () => {
    if (!selectedSize) {
      setError("Veuillez sélectionner une taille");
      return;
    }
    if (!selectedColor) {
      setError("Veuillez sélectionner une couleur");
      return;
    }

    addToCart({
      productId,
      name,
      category,
      price,
      image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    setShowSizeModal(false);
    setSelectedSize(null);
    setSelectedColor(null);
    setError("");
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
            {typeof oldPrice === "number" && oldPrice > 0 && (
              <span className="old">{formatPrice(oldPrice)}</span>
            )}
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

      {/* Size and Color Selection Modal */}
      {showSizeModal && (
        <div
          className="size-modal-overlay"
          onClick={() => setShowSizeModal(false)}
        >
          <div className="size-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Sélectionnez les options</h3>

            <div className="modal-section">
              <h4>
                Taille <span className="required">*</span>
              </h4>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      setError("");
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>
                Couleur <span className="required">*</span>
              </h4>
              <div className="color-options-circles">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`color-circle ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: colorMap[color] || "#cccccc",
                      border:
                        color === "Blanc"
                          ? "2px solid #e0d9d3"
                          : "2px solid transparent",
                    }}
                    onClick={() => {
                      setSelectedColor(color);
                      setError("");
                    }}
                    title={color}
                    aria-label={color}
                  >
                    {selectedColor === color && (
                      <span className="check-icon">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-actions">
              <button
                className="modal-btn modal-cancel"
                onClick={() => setShowSizeModal(false)}
              >
                Annuler
              </button>
              <button
                className="modal-btn modal-confirm"
                onClick={handleConfirmSelection}
              >
                Ajouter au panier
              </button>
            </div>
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
