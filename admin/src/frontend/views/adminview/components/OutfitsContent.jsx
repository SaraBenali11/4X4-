import React, { useState, useEffect } from "react";
import OutfitModal from "./OutfitModal";
import "./OutfitsContent.css";

export default function OutfitsContent() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/outfits");
      const data = await response.json();
      if (data.success) {
        setOutfits(data.data);
      } else {
        setError(data.error || "Failed to fetch outfits");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutfits();
  }, []);

  const handleCreate = () => {
    setEditingOutfit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (outfit) => {
    setEditingOutfit(outfit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tenue ?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/outfits/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setOutfits(outfits.filter((o) => o.id !== id));
      } else {
        alert("Erreur lors de la suppression: " + data.error);
      }
    } catch (err) {
      alert("Erreur serveur");
    }
  };

  const handleModalClose = (refresh) => {
    setIsModalOpen(false);
    if (refresh) {
      fetchOutfits();
    }
  };

  if (loading) return <div className="loading-state">Chargement des tenues...</div>;
  if (error) return <div className="error-state">Erreur: {error}</div>;

  return (
    <div className="outfits-content">
      <div className="outfits-header">
        <h2 className="outfits-title">Gestion des Tenues</h2>
        <button className="add-outfit-btn" onClick={handleCreate}>
          + Ajouter une Tenue
        </button>
      </div>

      <div className="outfits-table-container">
        <table className="outfits-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Produits</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {outfits.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  Aucune tenue trouvée. Cliquez sur "Ajouter une Tenue" pour en créer une.
                </td>
              </tr>
            ) : (
              outfits.map((outfit) => (
                <tr key={outfit.id}>
                  <td className="outfit-title-cell">{outfit.title}</td>
                  <td className="outfit-desc-cell">{outfit.description || "-"}</td>
                  <td className="outfit-products-cell">
                    {outfit.products && outfit.products.length > 0 ? (
                      <span className="products-count">
                        {outfit.products.length} produit{outfit.products.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="no-products">Aucun</span>
                    )}
                  </td>
                  <td className="outfit-date-cell">
                    {outfit.created_at ? new Date(outfit.created_at).toLocaleDateString("fr-FR") : "-"}
                  </td>
                  <td className="outfit-actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(outfit)} title="Modifier">
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(outfit.id)} title="Supprimer">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <OutfitModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          outfit={editingOutfit}
        />
      )}
    </div>
  );
}
