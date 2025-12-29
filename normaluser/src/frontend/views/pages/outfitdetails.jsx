import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/outfitdetails.css";
import { supabase } from "../../config/supabase";

export default function OutfitDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        setLoading(true);
        // Fetch outfit and related products
        const { data, error } = await supabase
          .from("outfits")
          .select(`
            *,
            outfit_products (
               product:products (*)
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;

        // Transform data
        const products = data.outfit_products?.map(op => op.product) || [];
        const formattedOutfit = {
          id: data.id,
          title: data.title,
          description: data.description,
          // Prefer outfit image, then first product image, then default
          image: data.image ? data.image : (products.length > 0 ? products[0].image_url : "https://via.placeholder.com/300?text=No+Image"),
          author: "Sutraty",
          products: products
        };

        setOutfit(formattedOutfit);
      } catch (err) {
        console.error("Error fetching outfit:", err);
        setError("Impossible de charger la tenue.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOutfit();
    }
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBack = () => {
    navigate("/outfits");
  };

  if (loading) return (
    <div className="homepage">
      <Header />
      <main className="outfit-details-page">
        <p>Chargement...</p>
      </main>
      <Footer />
    </div>
  );

  if (error || !outfit) {
    return (
      <div className="homepage">
        <Header />
        <main className="outfit-details-page">
          <p>{error || "Tenue non disponible"}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage">
      <Header />
      <main className="outfit-details-page">
        <div className="outfit-details-container">
          <button className="back-button" onClick={handleBack}>
            ← Retour
          </button>

          <div className="outfit-modal">
            <div className="outfit-left">
              <img src={outfit.image} alt={outfit.title} />
            </div>

            <div className="outfit-right">
              <h2>{outfit.title}</h2>
              <p className="outfit-author">Créé par {outfit.author}</p>
              <hr />

              <p className="section">
                Produits de cette tenue ({outfit.products.length})
              </p>

              {outfit.products.map((product) => (
                <div
                  key={product.id}
                  className="product"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={product.image_url} alt={product.name} />
                  <div className="info">
                    <span className="name">{product.name}</span>
                    <span className="price">
                      {product.price.toLocaleString()} DA
                    </span>
                  </div>
                  <button
                    className="eye"
                    onClick={() => handleProductClick(product.id)}
                    aria-label="View product details"
                  >
                    👁
                  </button>
                </div>
              ))}

              <div className="actions">
                <button className="close" onClick={handleBack}>
                  Fermer
                </button>
                <button className="fav">♡ Ajouter aux favoris</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
