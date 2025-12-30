import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import { supabase } from "../../../config/supabase.js";

export default function OutfitModal({ isOpen, onClose, outfit }) {
  const { admin } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)")
          .order("name");

        if (error) throw error;
        setAllProducts(data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (outfit) {
      setTitle(outfit.title);
      setDescription(outfit.description || "");
      setSelectedProducts(
        outfit.products ? outfit.products.map((p) => p.id) : []
      );
      setCurrentImage(outfit.image || null);
    } else {
      setTitle("");
      setDescription("");
      setSelectedProducts([]);
      setCurrentImage(null);
    }
    setImageFile(null);
  }, [outfit]);

  const toggleProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("outfits")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Use Signed URL (valid for 10 years) to bypass Public Bucket issues
    const { data, error: urlError } = await supabase.storage
      .from("outfits")
      .createSignedUrl(filePath, 315360000); // 10 years in seconds

    if (urlError) throw urlError;

    return data.signedUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let outfitId = outfit?.id;
      let finalImageUrl = currentImage;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const outfitData = {
        title,
        description,
        image: finalImageUrl,
      };

      if (admin?.id) {
        outfitData.created_by = admin.id;
      }

      if (outfit) {
        // UPDATE
        const { error } = await supabase
          .from("outfits")
          .update(outfitData)
          .eq("id", outfitId);

        if (error) throw error;

        // Update relations
        const { error: delError } = await supabase
          .from("outfit_products")
          .delete()
          .eq("outfit_id", outfitId);

        if (delError) throw delError;
      } else {
        // INSERT
        const { data, error } = await supabase
          .from("outfits")
          .insert(outfitData)
          .select();

        if (error) throw error;
        outfitId = data[0].id;
      }

      // Insert relations
      if (selectedProducts.length > 0) {
        const relations = selectedProducts.map((pId) => ({
          outfit_id: outfitId,
          product_id: pId,
        }));

        const { error: relError } = await supabase
          .from("outfit_products")
          .insert(relations);

        if (relError) throw relError;
      }

      onClose(true); // true = refresh
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3>{outfit ? "Modifier la Tenue" : "Créer une Tenue"}</h3>
          <button onClick={() => onClose(false)} style={styles.closeBtn}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Titre de la tenue</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Image de la tenue</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.input}
            />
            {(imageFile || currentImage) && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>Aperçu:</p>
                <img
                  src={
                    imageFile ? URL.createObjectURL(imageFile) : currentImage
                  }
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Sélectionner les produits</label>
            <div style={styles.productsList}>
              {loading ? (
                <p>Chargement des produits...</p>
              ) : (
                allProducts.map((p) => {
                  const productImage = p.product_images && p.product_images.length > 0
                    ? p.product_images[0].image_url
                    : null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      style={{
                        ...styles.productItem,
                        backgroundColor: selectedProducts.includes(p.id)
                          ? "#E4D0D0"
                          : "white",
                        borderColor: selectedProducts.includes(p.id)
                          ? "#867070"
                          : "#eee",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p.id)}
                        onChange={() => { }}
                        style={{ marginRight: "10px" }}
                      />
                      {productImage && (
                        <img
                          src={productImage}
                          alt={p.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      <span>
                        {p.name} - {p.price} DA
                      </span>
                    </div>
                  );
                })
              )}
              {allProducts.length === 0 && !loading && (
                <p>Aucun produit disponible</p>
              )}
            </div>
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              onClick={() => onClose(false)}
              style={styles.cancelBtn}
              disabled={saving}
            >
              Annuler
            </button>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  form: {
    padding: "20px",
    overflowY: "auto",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginTop: "5px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginTop: "5px",
    resize: "vertical",
  },
  productsList: {
    border: "1px solid #eee",
    borderRadius: "4px",
    maxHeight: "200px",
    overflowY: "auto",
    marginTop: "5px",
    padding: "5px",
  },
  productItem: {
    padding: "8px",
    borderBottom: "1px solid #f5f5f5",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: "4px",
    marginBottom: "2px",
  },
  footer: {
    padding: "15px 20px",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    color: "#867070",
  },
  saveBtn: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    background: "#867070",
    color: "white",
    cursor: "pointer",
  },
};
