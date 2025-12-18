import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export default function OutfitModal({ isOpen, onClose, outfit }) {
    const { admin } = useAdminAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load products for selector
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Assuming there is an endpoint for products. 
                // Based on app.py: app.register_blueprint(products_bp, url_prefix='/api')
                // We need to find the products endpoint. Usually /api/products
                const response = await fetch("http://localhost:5000/api/products");
                const data = await response.json();
                // Adjust based on actual product API response structure
                // Looking at ProduitsContent.jsx, it was mock data.
                // Looking at backend/controllers/products.py (I haven't read it but app.py registers it), 
                // I assume it returns standard JSON.
                if (data && (Array.isArray(data) || Array.isArray(data.products))) {
                    setAllProducts(Array.isArray(data) ? data : data.products);
                } else if (data.status === 'success' && data.data) {
                    setAllProducts(data.data);
                }
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
            setSelectedProducts(outfit.products ? outfit.products.map(p => p.id) : []);
        } else {
            setTitle("");
            setDescription("");
            setSelectedProducts([]);
        }
    }, [outfit]);

    const toggleProduct = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = outfit
                ? `http://localhost:5000/api/outfits/${outfit.id}`
                : "http://localhost:5000/api/outfits";

            const method = outfit ? "PUT" : "POST";

            const body = {
                title,
                description,
                product_ids: selectedProducts,
                created_by: admin ? admin.id : null
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const resData = await response.json();

            if (resData.success) {
                onClose(true); // true = refresh
            } else {
                alert("Erreur: " + resData.error);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la sauvegarde.");
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
                    <button onClick={() => onClose(false)} style={styles.closeBtn}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label>Titre de la tenue</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={styles.textarea}
                            rows={3}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Sélectionner les produits</label>
                        <div style={styles.productsList}>
                            {loading ? <p>Chargement des produits...</p> : (
                                allProducts.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => toggleProduct(p.id)}
                                        style={{
                                            ...styles.productItem,
                                            backgroundColor: selectedProducts.includes(p.id) ? "#E4D0D0" : "white",
                                            borderColor: selectedProducts.includes(p.id) ? "#867070" : "#eee"
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(p.id)}
                                            onChange={() => { }} // handled by div click
                                            style={{ marginRight: "10px" }}
                                        />
                                        <span>{p.name} - {p.price} DA</span>
                                    </div>
                                ))
                            )}
                            {allProducts.length === 0 && !loading && <p>Aucun produit disponible</p>}
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <button type="button" onClick={() => onClose(false)} style={styles.cancelBtn} disabled={saving}>
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
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000
    },
    modal: {
        backgroundColor: "white",
        borderRadius: "8px",
        width: "90%", maxWidth: "600px",
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    header: {
        padding: "15px 20px",
        borderBottom: "1px solid #eee",
        display: "flex", justifyContent: "space-between", alignItems: "center"
    },
    closeBtn: {
        background: "none", border: "none", fontSize: "24px", cursor: "pointer"
    },
    form: {
        padding: "20px",
        overflowY: "auto"
    },
    formGroup: {
        marginBottom: "15px"
    },
    input: {
        width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginTop: "5px"
    },
    textarea: {
        width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginTop: "5px", resize: "vertical"
    },
    productsList: {
        border: "1px solid #eee", borderRadius: "4px",
        maxHeight: "200px", overflowY: "auto", marginTop: "5px",
        padding: "5px"
    },
    productItem: {
        padding: "8px", borderBottom: "1px solid #f5f5f5",
        cursor: "pointer", display: "flex", alignItems: "center",
        border: "1px solid transparent", borderRadius: "4px", marginBottom: "2px"
    },
    footer: {
        padding: "15px 20px",
        borderTop: "1px solid #eee",
        display: "flex", justifyContent: "flex-end", gap: "10px"
    },
    cancelBtn: {
        padding: "8px 16px", borderRadius: "4px", border: "1px solid #ddd", background: "white", cursor: "pointer", color: "#867070"
    },
    saveBtn: {
        padding: "8px 16px", borderRadius: "4px", border: "none", background: "#867070", color: "white", cursor: "pointer"
    }
};
