import React, { useState } from "react";

export default function ProduitsContent() {
  const [products] = useState([
    {
      id: 1,
      name: "Abaya Élégante Beige",
      category: "Abaya",
      price: 8500,
      stock: 15,
    },
    {
      id: 2,
      name: "Robe Longue Crème",
      category: "Robes",
      price: 6500,
      stock: 8,
    },
    {
      id: 3,
      name: "Ensemble Chic Nude",
      category: "Ensembles",
      price: 7200,
      stock: 12,
    },
  ]);

  return (
    <div>
      <h2 className="panel-title">Gestion des Produits</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-cat">{p.category}</div>
              <div className="product-price">{p.price.toLocaleString()} DA</div>
              <div className="product-stock">Stock: {p.stock}</div>
            </div>
            <div className="product-actions">
              <button className="btn-edit">Modifier</button>
              <button className="btn-delete">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-add-product">+ Ajouter un produit</button>
    </div>
  );
}
