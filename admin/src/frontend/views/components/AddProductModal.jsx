import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/AddProductModal.css";
import { HexColorPicker } from "react-colorful";

export default function AddProductModal({
  onClose = () => {},
  onSave = () => {},
  product = null,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizesList, setSizesList] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorList, setColorList] = useState([]);
  const [currentColor, setCurrentColor] = useState("#000000");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      category,
      price: parseFloat(price),
      sizes: sizesList,
      colors: colorList,
    };

    onSave(payload);
  };

  useEffect(() => {
    if (product) {
      setName(product.name || product.produit || "");
      setCategory(product.category || product.categorie || "");
      setPrice(product.price ?? product.prix ?? "");
      const initialSizes =
        (Array.isArray(product.sizes) && product.sizes) ||
        (Array.isArray(product.tailles) && product.tailles) ||
        (typeof product.sizes === "string" && product.sizes
          ? product.sizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []) ||
        (typeof product.tailles === "string" && product.tailles
          ? product.tailles
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []);
      setSizesList(initialSizes);
      const initialColors =
        (product.colors && Array.isArray(product.colors) && product.colors) ||
        (product.couleurs &&
          Array.isArray(product.couleurs) &&
          product.couleurs) ||
        [];
      setColorList(initialColors);
    }
  }, [product]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>
            {product ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </h3>
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

          <div className="tag-input-section">
            <div className="tag-input-header">Tailles</div>
            <div className="tag-input-row">
              <input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = sizeInput.trim();
                    if (!v) return;
                    setSizesList((prev) =>
                      prev.includes(v) ? prev : [...prev, v]
                    );
                    setSizeInput("");
                  }
                }}
                placeholder="Ex: S, M, L"
              />
              <button
                type="button"
                className="btn-primary add-tag-btn"
                onClick={() => {
                  const v = sizeInput.trim();
                  if (!v) return;
                  setSizesList((prev) =>
                    prev.includes(v) ? prev : [...prev, v]
                  );
                  setSizeInput("");
                }}
              >
                Ajouter
              </button>
            </div>
            {sizesList.length > 0 && (
              <div className="tag-chips">
                {sizesList.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                    <button
                      type="button"
                      className="chip-remove"
                      aria-label={`Retirer ${s}`}
                      onClick={() =>
                        setSizesList((prev) => prev.filter((x) => x !== s))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="color-picker-section">
            <div className="color-picker-header">Couleurs</div>
            <div className="color-picker-wrapper">
              <HexColorPicker color={currentColor} onChange={setCurrentColor} />
              <div className="color-picker-actions">
                <div
                  className="selected-color-preview"
                  style={{ background: currentColor }}
                />
                <button
                  type="button"
                  className="btn-primary add-color-btn"
                  onClick={() => {
                    if (!currentColor) return;
                    setColorList((prev) =>
                      prev.includes(currentColor)
                        ? prev
                        : [...prev, currentColor]
                    );
                  }}
                >
                  Ajouter la couleur
                </button>
              </div>
            </div>
            {colorList.length > 0 && (
              <div className="color-swatches">
                {colorList.map((clr) => (
                  <div key={clr} className="swatch">
                    <span className="swatch-dot" style={{ background: clr }} />
                    <span className="swatch-label">{clr}</span>
                    <button
                      type="button"
                      className="remove-swatch-btn"
                      onClick={() =>
                        setColorList((prev) => prev.filter((c) => c !== clr))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
