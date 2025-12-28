import React, { useState, useEffect } from "react";
import "../styles/inspiration.css";
import Footer from "../components/footer";
import Header from "../components/header";
import { supabase } from "../../config/supabase";

function OutfitInspiration() {
  const [expandedOutfit, setExpandedOutfit] = useState(null);
  const [outfitsData, setOutfitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
          *,
          outfit_products (
            product:products (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((outfit) => ({
        id: outfit.id,
        name: outfit.title,
        author: outfit.author || "Anonymous",
        image: outfit.image,
        products:
          outfit.outfit_products?.map((op) => ({
            id: op.product.id,
            name: op.product.name,
            price: op.product.price,
            image: op.product.images ? op.product.images.split(",")[0] : "",
          })) || [],
      }));

      setOutfitsData(formattedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching outfits:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (outfitId) => {
    setExpandedOutfit(expandedOutfit === outfitId ? null : outfitId);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main>
          <div className="outfit-inspiration-page">
            <div className="inspiration-container">
              <div style={{ textAlign: "center", padding: "2rem" }}>
                Chargement des tenues...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main>
          <div className="outfit-inspiration-page">
            <div className="inspiration-container">
              <div
                style={{ textAlign: "center", padding: "2rem", color: "red" }}
              >
                Erreur: {error}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <div className="outfit-inspiration-page">
          <div className="inspiration-container">
            <h1 className="inspiration-title">Inspiration Tenues</h1>
            <p className="inspiration-subtitle">
              Découvrez comment nos clientes créent des looks uniques avec nos
              pièces.
            </p>

            <div className="outfits-grid">
              {outfitsData.map((outfit) => (
                <div key={outfit.id} className="outfit-card">
                  <div className="outfit-image-wrapper">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      className="outfit-image"
                    />
                  </div>

                  <div className="outfit-info">
                    <h3 className="outfit-name">{outfit.name}</h3>
                    <p className="outfit-author">Par {outfit.author}</p>

                    {expandedOutfit === outfit.id && (
                      <div className="outfit-products">
                        <h4 className="products-title">Produits utilisés:</h4>
                        <div className="products-list">
                          {outfit.products.map((product) => (
                            <div key={product.id} className="product-item">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-thumb"
                              />
                              <div className="product-details">
                                <p className="product-name">{product.name}</p>
                                <p className="product-price">
                                  {product.price} DA
                                </p>
                              </div>
                              <button
                                className="view-product-btn"
                                aria-label="Voir le produit"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className="toggle-products-btn"
                      onClick={() => toggleExpand(outfit.id)}
                    >
                      {expandedOutfit === outfit.id
                        ? "Masquer les produits"
                        : "Voir les produits"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={
                          expandedOutfit === outfit.id ? "rotated" : ""
                        }
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OutfitInspiration;
