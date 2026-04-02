import "./cart.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { formatPrice } from "../utils/formatters";

export default function CartModal({ open, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } =
    useContext(CartContext);

  if (!open) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <header className="cart-header">
          <h2>Panier</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="cart-table">
          <div className="cart-head">
            <span>Produit</span>
            <span>Prix</span>
            <span>Quantité</span>
            <span>Total</span>
          </div>

          {cartItems.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#9b7f7a" }}
            >
              Panier vide
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}`}
                item={item}
                onRemove={() => removeFromCart(item.productId, item.size)}
                onQuantityChange={(qty) =>
                  updateQuantity(item.productId, item.size, qty)
                }
              />
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <button className="btn-order" disabled={cartItems.length === 0}>
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="cart-row">
      <div className="product">
        <img src={item.image} alt={item.name} />
        <div>
          <h4>{item.name}</h4>
          <p>Taille: {item.size}</p>
          <p>Catégorie: {item.category}</p>
        </div>
      </div>

      <span>{item.price ? `${item.price.toLocaleString()} DA` : "N/A"}</span>

      <div className="qty">
        <button onClick={() => onQuantityChange(item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onQuantityChange(item.quantity + 1)}>+</button>
      </div>

      <div className="row-total">
        <span>
          {item.price
            ? `${(item.price * item.quantity).toLocaleString()} DA`
            : "N/A"}
        </span>
        <button className="delete" onClick={onRemove}>
          🗑
        </button>
      </div>
    </div>
  );
}
