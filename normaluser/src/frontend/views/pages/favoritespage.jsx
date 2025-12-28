import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductCard from "../components/ProductCard";
import OutfitCard from "../components/OutfitCard";
import { FavoritesContext } from "../../context/FavoritesContext";
import "../styles/favorites.css";

function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);

  // Separate outfits and products
  const outfits = favorites.filter((item) => item.type === "outfit");
  const products = favorites.filter((item) => item.type !== "outfit");

  return (
    <div className="favorites-page">
      <Header />
      <main className="favorites-container">
        <div className="favorites-header">
          <h1>Mes Favoris</h1>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">♡</div>
            <h2>Aucun article en favori</h2>
            <p>
              Découvrez nos produits et tenues et ajoutez-les à votre liste de
              favoris
            </p>
            <Link to="/produits" className="btn-back-shopping">
              Continuer les achats
            </Link>
          </div>
        ) : (
          <>
            {/* Tenues Section */}
            {outfits.length > 0 && (
              <div className="favorites-section">
                <div className="section-header">
                  <h2>Tenues</h2>
                  <span className="section-count">
                    {outfits.length} {outfits.length === 1 ? "tenue" : "tenues"}
                  </span>
                </div>
                <div className="favorites-grid">
                  {outfits.map((outfit) => (
                    <OutfitCard
                      key={outfit.productId}
                      outfit={{
                        id: outfit.id,
                        image: outfit.image,
                        title: outfit.title,
                        author: outfit.author,
                        products: outfit.products || [],
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <div className="favorites-section">
                <div className="section-header">
                  <h2>Pièces</h2>
                  <span className="section-count">
                    {products.length}{" "}
                    {products.length === 1 ? "pièce" : "pièces"}
                  </span>
                </div>
                <div className="favorites-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.productId}
                      productId={product.productId}
                      image={product.image}
                      name={product.name}
                      category={product.category}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      isNew={product.isNew}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FavoritesPage;
