import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import outfitsData from "../data/outfits";
import "../styles/outfitdetails.css";

export default function OutfitDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the outfit by ID
  const outfit = outfitsData.find((o) => o.id === parseInt(id));

  if (!outfit) {
    return (
      <div className="homepage">
        <Header />
        <main className="outfit-details-page">
          <p>Tenue non disponible</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBack = () => {
    navigate("/outfits");
  };

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

              {outfit.products.map((product, idx) => (
                <div key={idx} className="product">
                  <img src={product.image} alt={product.name} />
                  <div className="info">
                    <span className="name">{product.name}</span>
                    <span className="price">
                      {product.price.toLocaleString()} DA
                    </span>
                  </div>
                  <button
                    className="eye"
                    onClick={() => handleProductClick(product.productId)}
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
