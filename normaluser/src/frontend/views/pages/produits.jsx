import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import FilterBar from "../components/Filters";
import ProductCard from "../components/ProductCard";
import "../styles/produits.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { productService } from "../../services/productService";

function ProductsPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: location.state?.category || "Tous",
    price: "Tous",
    sort: "Nouveautés",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setFilters((prev) => ({
        ...prev,
        category: location.state.category,
      }));
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (filters.category !== "Tous") {
      filtered = filtered.filter(
        (product) => (product.categories?.name === filters.category) || (product.category === filters.category)
      );
    }

    // Filter by price
    if (filters.price !== "Tous") {
      if (filters.price === "Moins de 6000 DA") {
        filtered = filtered.filter((product) => product.price < 6000);
      } else if (filters.price === "6000 - 8000 DA") {
        filtered = filtered.filter(
          (product) => product.price >= 6000 && product.price <= 8000
        );
      } else if (filters.price === "Plus de 8000 DA") {
        filtered = filtered.filter((product) => product.price > 8000);
      }
    }

    // Sort products
    if (filters.sort === "Prix croissant") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "Prix décroissant") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "Nom A-Z") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "Nouveautés") {
      // filtered.sort((a, b) => b.is_new - a.is_new);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <Header />

      <div className="products-page">
        <div className="products-container">
          {/* Sidebar with filters */}
          <aside className="products-sidebar">
            <FilterBar
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </aside>

          {/* Main content area */}
          <main className="products-main">
            <div className="products-header">
              <h1 className="products-title">Explorez nos Produits</h1>
              <p className="products-count">
                {filteredProducts.length} produits trouvés
              </p>
            </div>

            {loading ? (
              <p>Chargement...</p>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => {
                  // Get image from product_images relation
                  const imgUrl = product.product_images && product.product_images.length > 0
                    ? product.product_images[0].image_url
                    : product.image_url || 'https://via.placeholder.com/300';

                  return (
                    <div key={product.id} className="product-card-wrapper">
                      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ProductCard
                          image={imgUrl}
                          name={product.name}
                          category={product.categories?.name || product.category || ""}
                          price={product.promo_price || product.price}
                          oldPrice={product.promo_price ? product.price : null}
                          isNew={product.status === 'new'}
                          status={product.status}
                          productId={product.id}
                        />
                      </Link>
                      <div className="product-boutiques">
                        <span style={{ fontSize: '12px', color: '#666' }}>Disponible</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductsPage;
