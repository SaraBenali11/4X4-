import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/AddProductModal.css";

export default function AddProductModal({
  onClose = () => {},
  onSave = () => {},
  product = null,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this should call backend API to add product.
    // For now, it just closes the modal.
    const payload = {
      name,
      category,
      price: parseFloat(price),
      sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      colors: colors ? colors.split(",").map((c) => c.trim()) : [],
    };

    onSave(payload);
  };

  // Prefill when editing
  useEffect(() => {
    if (product) {
      setName(product.name || product.produit || "");
      setCategory(product.category || product.categorie || "");
      setPrice(product.price ?? product.prix ?? "");
      setSizes(
        (product.sizes && product.sizes.join(",")) ||
          (product.tailles && product.tailles.join(",")) ||
          ""
      );
      setColors(
        (product.colors && product.colors.join(",")) ||
          (product.couleurs && product.couleurs.join(",")) ||
          ""
      );
    }
  }, [product]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="modal-header">
          <h3>Ajouter un nouveau produit</h3>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            ✖
          </button>
        </header>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Nom du produit
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Catégorie
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </label>

          <label>
            Prix
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
            />
          </label>

          <label>
            Tailles (séparées par des virgules)
            <input value={sizes} onChange={(e) => setSizes(e.target.value)} />
          </label>

          <label>
            Couleurs (séparées par des virgules)
            <input value={colors} onChange={(e) => setColors(e.target.value)} />
          </label>

          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {product ? "Modifier" : "Ajouter"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

AddProductModal.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  product: PropTypes.object,
};
