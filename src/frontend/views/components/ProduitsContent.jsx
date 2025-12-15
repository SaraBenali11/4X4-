import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { productsData as localProducts } from "../../../database/data/adminData";
import { API_BASE_URL } from '../../config/constants';
import AddProductModal from "./AddProductModal";
import ConfirmModal from './ConfirmModal';

export default function ProduitsContent() {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const productsRef = useRef(products);
    useEffect(() => { productsRef.current = products; }, [products]);

    // Helper: fetch products from backend (used on mount and after changes)
    const fetchProducts = useCallback(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/products`);
          if (!res.ok) { throw new Error('Failed to fetch products'); }
          const json = await res.json();
          if (json && json.data) {
            // adapt data to local schema if needed
            const adapted = json.data.map((p) => ({
              id: p.id,
              produit: p.name,
              categorie: p.category,
              prix: p.price,
              statuts: [p.isNew ? 'Nouveau' : null, p.isBestSeller ? 'Best Seller' : null].filter(Boolean),
            }));
            setProducts(adapted);
            setBackendAvailable(true);
            return true;
          }
        } catch (e) {
          // fallback to included data
          console.warn('Using local product data:', e.message);
          // Only set fallback sample data if list is empty (initial load)
          if (!productsRef.current || productsRef.current.length === 0) {
            setProducts(localProducts);
          }
          setBackendAvailable(false);
          return false;
        }
    }, []);

    useEffect(() => {
      fetchProducts();
    }, [fetchProducts]);

    const handleEdit = (p) => {
      setEditingProduct(p);
      setShowModal(true);
    };

    const handleDelete = async (p) => {
      // Show confirmation modal
      setDeleteTarget(p);
      setShowConfirm(true);
    };

    const performDelete = async () => {
      const p = deleteTarget;
      setShowConfirm(false);
      setDeleteTarget(null);
      // If backend is not available, simply remove locally
      if (!backendAvailable) {
        setProducts((prev) => prev.filter((x) => x.id !== p.id));
        alert('Produit supprimé localement');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${p.id}`, { method: 'DELETE' });
        const respBody = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = respBody?.message || respBody?.error || 'Erreur lors de la suppression';
          throw new Error(msg);
        }
        // Re-fetch after delete to keep local UI synced
          const ok = await fetchProducts();
          if (!ok) {
          // Ensure we remove the deleted item from local state even if re-fetch failed
          setProducts((prev) => prev.filter((x) => x.id !== p.id));
          alert('Suppression enregistrée localement mais impossible de synchroniser avec le serveur.');
          }
        alert(respBody?.message || 'Produit supprimé');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Erreur lors de la suppression');
      }
    };
  
    return (
      <div className="produits-content">
        <div className="produits-header">
          <h3 className="produits-title">Gestion des Produits</h3>
          <button className="add-product-btn" onClick={() => setShowModal(true)}>
            + Ajouter Produit
          </button>
        </div>
  
        <div className="produits-header-row">
          <div className="header-cell produit-cell">Produit</div>
          <div className="header-cell categorie-cell">Catégorie</div>
          <div className="header-cell prix-cell">Prix</div>
          <div className="header-cell statut-cell">Statut</div>
          <div className="header-cell actions-header">Actions</div>
        </div>
  
        <div className="produits-rows">
          {products.map((produit) => (
            <div key={produit.id} className="produit-row">
              <div className="row-cell produit-cell">
                <div className="produit-image-placeholder"></div>
                <span>{produit.produit || produit.name}</span>
              </div>
              <div className="row-cell categorie-cell">{produit.categorie || produit.category}</div>
              <div className="row-cell prix-cell">{produit.prix ?? produit.price}</div>
              <div className="row-cell statut-cell">
                <div className="statuts-container">
                  {(produit.statuts || []).map((statut, index) => (
                    <span
                      key={index}
                      className={`statut-tag ${
                        statut === "Best Seller" ? "best-seller" : "nouveau"
                      }`}
                    >
                      {statut}
                    </span>
                  ))}
                </div>
              </div>
              <div className="row-cell actions-cell">
                <div className="action-icons">
                  <button className="icon-btn edit-btn" title="Modifier" onClick={() => handleEdit(produit)}>
                    <FiEdit2 className="action-icon" />
                  </button>
                  <button className="icon-btn delete-btn" title="Supprimer" onClick={() => handleDelete(produit)}>
                    <FiTrash2 className="action-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {showModal && (
          <AddProductModal
            product={editingProduct}
            onClose={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
            onSave={async (payload) => {
              try {
                if (editingProduct) {
                  // Update request
                  if (backendAvailable) {
                    const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) { throw new Error('Failed to update product'); }
                    // Try to re-fetch authoritative list from backend; if it fails, keep local update
                    const reloaded = await fetchProducts();
                    if (!reloaded) {
                      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload, produit: payload.name, categorie: payload.category, prix: payload.price } : p)));
                      alert('Le produit a été modifié localement, mais la mise à jour sur le serveur a échoué.');
                    }
                  } else {
                    // update local copy
                    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload, produit: payload.name, categorie: payload.category, prix: payload.price } : p)));
                  }
                } else {
                  if (backendAvailable) {
                    const res = await fetch(`${API_BASE_URL}/api/products`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) { throw new Error('Failed to add product'); }
                    const json = await res.json();
                    const id = json?.data?.id || Date.now();
                    const reloaded = await fetchProducts();
                    if (!reloaded) {
                      setProducts((prev) => [{ id, produit: payload.name, categorie: payload.category, prix: payload.price, statuts: [] }, ...prev]);
                      alert('Le produit a été ajouté localement, mais l\'enregistrement sur le serveur a échoué.');
                    }
                  } else {
                    // Add locally
                    const id = Date.now();
                    setProducts((prev) => [{ id, produit: payload.name, categorie: payload.category, prix: payload.price, statuts: [] }, ...prev]);
                  }
                }
                setShowModal(false);
                setEditingProduct(null);
              } catch (err) {
                console.error(err);
                alert(err.message || 'Action failed');
              }
            }}
          />
        )}
        {showConfirm && (
          <ConfirmModal
            title="Supprimer le produit"
            message={`Voulez-vous vraiment supprimer le produit "${deleteTarget?.produit || deleteTarget?.name}" ?`}
            confirmText="Supprimer"
            cancelText="Annuler"
            onCancel={() => { setShowConfirm(false); setDeleteTarget(null); }}
            onConfirm={performDelete}
          />
        )}
      </div>
    );
  }
  