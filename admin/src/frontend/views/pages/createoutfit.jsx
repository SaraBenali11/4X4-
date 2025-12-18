import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/createoutfits.css';
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
  },
  {
    id: 2,
    image: image2,
    name: 'Robe Longue Crème',
    category: 'Robes',
    price: 6500,
  },
  {
    id: 3,
    image: image3,
    name: 'Ensemble Chic Nude',
    category: 'Ensembles',
    price: 7200,
  },
];

function OutfitCreator() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [userName, setUserName] = useState('');

  const handleProductClick = (product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);

    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleSubmit = () => {
    if (selectedProducts.length === 0 || !outfitName || !userName) {
      alert('Veuillez remplir tous les champs et sélectionner au moins un produit.');
      return;
    }

    // Outfit submitted - in production, send to backend or analytics

    alert('Votre tenue a été soumise avec succès!');
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  return (
    <div>
      <Header />
      <main>
        <div className="outfit-creator-page">
          <div className="outfit-creator-container">
            {/* Left Side - Product Selection */}
            <div className="outfit-left">
              <h1 className="outfit-main-title">Créateur de Tenues</h1>
              <p className="outfit-subtitle">
                Sélectionnez des produits pour créer votre look unique et inspirez d'autres
                clientes!
              </p>

              <h2 className="section-title">Sélectionnez les Produits</h2>

              <div className="products-selection-grid">
                {productsData.map((product) => (
                  <div
                    key={product.id}
                    className={`product-card-container ${
                      isProductSelected(product.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleProductClick(product)}
                  >
                    <ProductCard
                      image={product.image}
                      name={product.name}
                      category={product.category}
                      price={product.price}
                      productId={product.id}
                    />
                    {isProductSelected(product.id) && (
                      <button
                        className="remove-product-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveProduct(product.id);
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Outfit Summary */}
            <div className="outfit-right">
              <div className="outfit-summary-card">
                <h2 className="summary-title">Votre Tenue</h2>

                {/* Selected Products */}
                <div className="selected-products-list">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="selected-product-item">
                      <img src={product.image} alt={product.name} />
                      <span className="selected-product-name">{product.name}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveProduct(product.id)}
                        aria-label="Retirer le produit"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {selectedProducts.length === 0 && (
                    <p className="empty-message">Aucun produit sélectionné</p>
                  )}
                </div>

                {/* Outfit Name Input */}
                <div className="form-group">
                  <label htmlFor="outfitName">Nom de la Tenue *</label>
                  <input
                    id="outfitName"
                    type="text"
                    placeholder="Ex: Look Soirée Chic"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                  />
                </div>

                {/* User Name Input */}
                <div className="form-group">
                  <label htmlFor="userName">Votre Nom *</label>
                  <input
                    id="userName"
                    type="text"
                    placeholder="Ex: Amina K."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                {/* Info Message */}
                <div className="info-message">
                  Votre tenue sera soumise pour approbation avant publication.
                </div>

                {/* Submit Button */}
                <button
                  className="submit-outfit-btn"
                  onClick={handleSubmit}
                  disabled={selectedProducts.length === 0 || !outfitName || !userName}
                >
                  Soumettre la Tenue
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

export default OutfitCreator;
