import React, { useState } from "react";
import { Shirt, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal.jsx";
import AddProductModal from "./AddProductModal.jsx";

export default function ProduitsContent() {
  const [products, setProducts] = useState([
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
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDeleteClick = (product) => {
    setDeleteConfirm({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  const confirmDelete = () => {
    // Here you would actually delete the product
    console.log("Deleting product:", deleteConfirm.productId);
    setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAddOpen(true);
  };

  const handleSave = (payload) => {
    if (editingProduct) {
      // update existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: payload.name,
                category: payload.category,
                price: payload.price,
                // sizes/colors are optional in local admin demo
              }
            : p
        )
      );
    } else {
      // add new product
      const id = Date.now();
      setProducts((prev) => [
        {
          id,
          name: payload.name,
          category: payload.category,
          price: payload.price,
          stock: 0,
        },
        ...prev,
      ]);
    }
    setIsAddOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="produits-content">
      <div className="produits-header">
        <h2 className="produits-title">Gestion des Produits</h2>
        <button className="add-product-btn" onClick={() => setIsAddOpen(true)}>
          Ajouter un produit
        </button>
      </div>
      <div className="products-list">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <div className="product-left">
              <div className="product-image-wrapper">
                <div className="product-image-placeholder">
                  <Shirt size={28} />
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-cat">{p.category}</div>
              </div>
            </div>
            <div className="product-middle">
              <div className="product-price">{p.price.toLocaleString()} DA</div>
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => handleEditClick(p)}>
                <Pencil size={16} />
                Modifier
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteClick(p)}
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.productName}"? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, productId: null, productName: "" })
        }
        type="danger"
      />
      {isAddOpen && (
        <AddProductModal
          product={editingProduct}
          onClose={() => {
            setIsAddOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
