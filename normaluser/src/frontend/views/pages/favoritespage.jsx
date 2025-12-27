import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductCard from "../components/ProductCard";
import { FavoritesContext } from "../../context/FavoritesContext";
import "../styles/favorites.css";

function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="favorites-page">
      <Header />
      <main className="favorites-container">
        <div className="favorites-header">
          <h1>Mes Favoris</h1>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? "produit" : "produits"}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">♡</div>
            <h2>Aucun produit en favori</h2>
            <p>
              Découvrez nos produits et ajoutez les à votre liste de favoris
            </p>
            <Link to="/produits" className="btn-back-shopping">
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((product) => (
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
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FavoritesPage;
