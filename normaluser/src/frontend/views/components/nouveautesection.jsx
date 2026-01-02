import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../styles/nouveautesection.css";
import { productService } from "../../services/productService";

function NewArrivals({
  title = "Nouveautés",
  subtitle = "Découvrez nos dernières créations, alliant tradition et modernité",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const newestThree = products.slice(0, 3);

  return (
    <section className="nouveautes-section">
      <div className="nouveautes-container">
        <div className="nouveautes-header">
          <h2 className="nouveautes-title">{title}</h2>
          <p className="nouveautes-subtitle">{subtitle}</p>
        </div>

        <div className="nouveautes-grid">
          {loading && <p>Chargement...</p>}
          {!loading &&
            newestThree.map((product) => {
              const imgUrl =
                product.product_images && product.product_images.length > 0
                  ? product.product_images[0].image_url
                  : product.image_url || "https://via.placeholder.com/300";

              return (
                <ProductCard
                  key={product.id}
                  image={imgUrl}
                  name={product.name}
                  category={product.categories?.name || product.category || ""}
                  price={product.promo_price || product.price}
                  oldPrice={product.promo_price ? product.price : null}
                  isNew={product.status === "new"}
                  status={product.status}
                  productId={product.id}
                />
              );
            })}
        </div>

        <div className="nouveautes-footer">
          <Link to="/produits" className="nouveautes-see-more">
            Voir plus
          </Link>
        </div>
      </div>
    </section>
  );
}

NewArrivals.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default NewArrivals;
