import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/Filters';
import ProductCard from '../components/ProductCard';
import '../styles/produits.css';
import Header from '../components/header';
import Footer from '../components/footer';
import image1 from '../../assets/images/image.png';
import image2 from '../../assets/images/img2.png';
import image3 from '../../assets/images/img3.png';

// Sample products data
const productsData = [
  {
    id: 1,
    image: image1,
    name: 'Abaya Élégante Beige',
    category: 'Abaya',
    price: 8500,
    isNew: true,
    boutiques: 3,
  },
  {
    id: 2,
    image: image2,
    name: 'Robe Longue Crème',
    category: 'Robes',
    price: 6500,
    isNew: true,
    boutiques: 3,
  },
  {
    id: 3,
    image: image3,
    name: 'Ensemble Chic Nude',
    category: 'Ensembles',
    price: 7200,
    isNew: false,
    boutiques: 3,
  },
  {
    id: 4,
    image: image1,
    name: 'Pantalon Denim Élégant',
    category: 'Pantalons',
    price: 5500,
    isNew: false,
    boutiques: 2,
  },
  {
    id: 5,
    image: image2,
    name: 'Haut Brodé Blanc',
    category: 'Hauts',
    price: 4200,
    isNew: true,
    boutiques: 3,
  },
  {
    id: 6,
    image: image3,
    name: 'Ensemble Moderne Noir',
    category: 'Ensembles',
    price: 9200,
    isNew: false,
    boutiques: 2,
  },
];

function ProductsPage() {
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: location.state?.category || 'Tous',
    price: 'Tous',
    sort: 'Nouveautés',
  });

  useEffect(() => {
    if (location.state?.category) {
      setFilters((prev) => ({
        ...prev,
        category: location.state.category,
      }));
    }
  }, [location.state]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...productsData];

    // Filter by category
    if (filters.category !== 'Tous') {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    // Filter by price
    if (filters.price !== 'Tous') {
      if (filters.price === 'Moins de 6000 DA') {
        filtered = filtered.filter((product) => product.price < 6000);
      } else if (filters.price === '6000 - 8000 DA') {
        filtered = filtered.filter((product) => product.price >= 6000 && product.price <= 8000);
      } else if (filters.price === 'Plus de 8000 DA') {
        filtered = filtered.filter((product) => product.price > 8000);
      }
    }

    // Sort products
    if (filters.sort === 'Prix croissant') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'Prix décroissant') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'Nom A-Z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === 'Nouveautés') {
      filtered.sort((a, b) => b.isNew - a.isNew);
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
            <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
          </aside>

          {/* Main content area */}
          <main className="products-main">
            <div className="products-header">
              <h1 className="products-title">Explorez nos Produits</h1>
              <p className="products-count">{filteredProducts.length} produits trouvés</p>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard
                    image={product.image}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    isNew={product.isNew}
                    productId={product.id}
                  />
                  <div className="product-boutiques">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{product.boutiques} boutiques</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductsPage;
