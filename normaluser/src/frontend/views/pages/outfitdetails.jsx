import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { supabase } from "../../config/supabase";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CartContext } from "../../context/CartContext";
import { ShoppingBag } from "lucide-react";
import "../styles/outfitdetails.css";

export default function OutfitDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  const favorited = outfit ? isFavorite(`outfit-${outfit.id}`) : false;

  useEffect(() => {
    fetchOutfit();
  }, [id]);

  const fetchOutfit = async () => {
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
        .eq("id", id)
        .single();

      if (error) throw error;

      const formattedOutfit = {
        id: data.id,
        image: data.image,
        title: data.title,
        author: data.author || "Anonymous",
        description: data.description || "",
        products:
          data.outfit_products?.map((op) => ({
            id: op.product.id,
            name: op.product.name,
            price: op.product.price,
            image: op.product.images ? op.product.images.split(",")[0] : "",
          })) || [],
      };

      setOutfit(formattedOutfit);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching outfit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBack = () => {
    navigate("/outfits");
  };

  const handleFavoriteClick = () => {
    if (outfit) {
      toggleFavorite({
        productId: `outfit-${outfit.id}`,
        ...outfit,
        type: "outfit",
      });
    }
  };

  const handleAddToCart = () => {
    if (!outfit || !outfit.products) return;

    outfit.products.forEach((product) => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: "M", // Taille par défaut
        quantity: 1,
      });
    });

    alert(
      `Tous les produits de la tenue "${outfit.title}" ont été ajoutés au panier !`
    );
  };

  const handleOrder = () => {
    if (!outfit || !outfit.products) return;

    // Ajouter tous les produits au panier
    outfit.products.forEach((product) => {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: "M", // Taille par défaut
        quantity: 1,
      });
    });

    // Rediriger vers la page de commande/checkout
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="homepage">
        <Header />
        <main className="outfit-details-page">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            Chargement...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="homepage">
        <Header />
        <main className="outfit-details-page">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p>Tenue non disponible</p>
            <button onClick={handleBack} style={{ marginTop: "1rem" }}>
              Retour
            </button>
          </div>
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

              {outfit.description && (
                <>
                  <hr />
                  <div className="outfit-description">
                    <p className="section-title">Description</p>
                    <p className="description-text">{outfit.description}</p>
                  </div>
                </>
              )}

              <hr />

              <p className="section-title">
                Produits de cette tenue ({outfit.products.length})
              </p>

              <div className="products-list">
                {outfit.products.map((product) => (
                  <div key={product.id} className="product">
                    <img src={product.image} alt={product.name} />
                    <div className="info">
                      <span className="name">{product.name}</span>
                      <span className="price">
                        {product.price
                          ? Math.round(product.price)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          : 0}{" "}
                        DA
                      </span>
                    </div>
                    <button
                      className="eye"
                      onClick={() => handleProductClick(product.id)}
                      aria-label="View product details"
                      title="Voir les détails"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="actions">
                <button
                  className="btn-add-to-cart"
                  onClick={handleAddToCart}
                  title="Ajouter tous les produits au panier"
                >
                  <ShoppingBag size={18} />
                  Ajouter au panier
                </button>
                <button
                  className={`fav ${favorited ? "favorited" : ""}`}
                  onClick={handleFavoriteClick}
                >
                  {favorited ? "♥" : "♡"}{" "}
                  {favorited ? "Retiré des" : "Ajouter aux"} favoris
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
