import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { CartContext } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import { WILAYAS } from "../../config/wilayas";
import { formatPrice } from "../../utils/formatters";
import "../styles/orderform.css";

export default function OrderForm() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    wilaya: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Le nom complet est requis";
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^0[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format invalide (ex: 0555123456)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.wilaya) newErrors.wilaya = "La wilaya est requise";
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await orderService.createOrder({
        ...formData,
        cartItems,
        status: "en attente", // match DB check constraint (lowercase!)
      });

      clearCart();
      navigate("/", { state: { orderSuccess: true } });
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.message || "Une erreur est survenue lors de la création de la commande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="order-form-page">
      <Header />
      <main className="order-form-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Retour
        </button>

        <div className="order-form-content">
          <div className="order-form-header">
            <h1>Formulaire de Commande</h1>
            <p>Remplissez le formulaire ci-dessous pour commander vos produits.</p>
          </div>

          {/* Products Section */}
          <div className="products-section">
            <h2>Vos produits</h2>
            <div className="products-list">
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${item.color || 'no-color'}-${index}`} className="product-item">
                  <img
                    src={item.image || "https://via.placeholder.com/80x100?text=No+Image"}
                    alt={item.name}
                    className="product-image"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80x100?text=No+Image"; }}
                  />
                  <div className="product-details">
                    <h3>{item.name}</h3>
                    <p>Taille: {item.size} • Couleur: {item.color || "N/A"}</p>
                    <p className="product-price">
                      {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="products-total">
              <span>Total</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="order-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="full_name">Nom Complet <span className="required">*</span></label>
              <input type="text" id="full_name" name="full_name" placeholder="Entrez votre nom complet" value={formData.full_name} onChange={handleChange} className={errors.full_name ? "error" : ""} />
              {errors.full_name && <span className="field-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Numéro de Téléphone <span className="required">*</span></label>
              <input type="tel" id="phone" name="phone" placeholder="Ex: 0555123456" value={formData.phone} onChange={handleChange} className={errors.phone ? "error" : ""} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input type="email" id="email" name="email" placeholder="Entrez votre email" value={formData.email} onChange={handleChange} className={errors.email ? "error" : ""} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="wilaya">Wilaya <span className="required">*</span></label>
              <select id="wilaya" name="wilaya" value={formData.wilaya} onChange={handleChange} className={errors.wilaya ? "error" : ""}>
                <option value="">Sélectionnez une wilaya</option>
                {WILAYAS.map((wilaya) => (<option key={wilaya} value={wilaya}>{wilaya}</option>))}
              </select>
              {errors.wilaya && <span className="field-error">{errors.wilaya}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Adresse <span className="required">*</span></label>
              <input type="text" id="address" name="address" placeholder="Entrez votre adresse complète" value={formData.address} onChange={handleChange} className={errors.address ? "error" : ""} />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="info-box">
              <strong>Important:</strong> Aucun paiement en ligne n'est requis. Notre équipe vous contactera pour confirmer votre commande et organiser le paiement à la livraison.
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer la Commande"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
