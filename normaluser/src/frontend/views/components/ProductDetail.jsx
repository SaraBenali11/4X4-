import React, { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { ShoppingBag } from "lucide-react";
import PropTypes from "prop-types";
import "../styles/ProductDetail.css";

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

// ProductDetail Component
const ProductDetail = ({ product, onBack }) => {
  // Initialize state with null to force user selection
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite: toggleFav } =
    useContext(FavoritesContext);

  const favorited = isFavorite(product?.id);

  // Fallback for missing product (prevents runtime errors when mounted without props)
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="detail-container">
          <button
            className="back-button"
            onClick={onBack || (() => window.history.back())}
          >
            ← Retour
          </button>
          <div className="detail-content">
            <p>Produit non disponible. Veuillez revenir en arrière.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Validate size and color selection
    if (!selectedSize) {
      setError("Veuillez sélectionner une taille");
      return;
    }
    if (!selectedColor) {
      setError("Veuillez sélectionner une couleur");
      return;
    }

    setError("");
    addToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });
    // Reset quantity after adding
    setQuantity(1);
  };

  const handleToggleFavorite = () => {
    toggleFav({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      oldPrice: product.oldPrice,
      isNew: product.isNew,
    });
  };

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
            <p className="detail-price">
              {Math.round(product.price)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              DA
            </p>

            <div className="detail-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="detail-section">
              <h3>
                Taille <span className="required">*</span>
              </h3>
              <div className="size-options">
                {product.sizes.map((size) => (
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

            <div className="detail-section">
              <h3>
                Couleur <span className="required">*</span>
              </h3>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-circle ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: colorMap[color] || "#cccccc",
                      border:
                        color === "Blanc"
                          ? "2px solid #d4c5bd"
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

            <div className="quantity-section">
              <label htmlFor="quantity">Quantité:</label>
              <div className="quantity-input">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="product-actions">
              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                title="Ajouter au panier"
              >
                <ShoppingBag size={18} />
                Ajouter au panier
              </button>
              <button
                className={`btn-favorite ${favorited ? "favorited" : ""}`}
                onClick={handleToggleFavorite}
              >
                {favorited ? "♥" : "♡"}{" "}
                {favorited ? "Retiré des" : "Ajouter aux"} favoris
              </button>
            </div>

            <p className="note">
              <strong>Note:</strong> Après avoir soumis votre commande, notre
              équipe vous contactera pour confirmer les détails et organiser la
              livraison.
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
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ProductDetail;
