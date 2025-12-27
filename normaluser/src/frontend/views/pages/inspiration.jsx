import React, { useState } from 'react';
import '../styles/inspiration.css';
import Footer from '../components/footer';
import Header from '../components/header';
import image1 from '../../assets/images/image.png';
import image2 from '../../assets/images/img2.png';
import image3 from '../../assets/images/img3.png';

// Sample outfits data
const outfitsData = [
  {
    id: 1,
    name: 'Tenue Élégante du Jour',
    author: 'Amina K.',
    image: image1,
    products: [
      {
        id: 1,
        name: 'Ensemble Chic Nude',
        price: 7200,
        image: image2,
      },
      {
        id: 2,
        name: 'Abaya Traditionnelle',
        price: 7800,
        image: image3,
      },
    ],
  },
  {
    id: 2,
    name: 'Look Soirée Chic',
    author: 'Sarah M.',
    image: image2,
    products: [
      {
        id: 3,
        name: 'Robe de Soirée Rose',
        price: 9500,
        image: image1,
      },
    ],
  },
  {
    id: 3,
    name: 'Style Décontracté',
    author: 'Leila B.',
    image: image3,
    products: [
      {
        id: 4,
        name: 'Robe Longue Crème',
        price: 6500,
        image: image2,
      },
      {
        id: 5,
        name: 'Tunique Brodée Beige',
        price: 5200,
        image: image1,
      },
    ],
  },
];

function OutfitInspiration() {
  const [expandedOutfit, setExpandedOutfit] = useState(null);

  const toggleExpand = (outfitId) => {
    setExpandedOutfit(expandedOutfit === outfitId ? null : outfitId);
  };

  return (
    <div>
      <Header />
      <main>
        <div className="outfit-inspiration-page">
          <div className="inspiration-container">
            <h1 className="inspiration-title">Inspiration Tenues</h1>
            <p className="inspiration-subtitle">
              Découvrez comment nos clientes créent des looks uniques avec nos pièces.
            </p>

            <div className="outfits-grid">
              {outfitsData.map((outfit) => (
                <div key={outfit.id} className="outfit-card">
                  <div className="outfit-image-wrapper">
                    <img src={outfit.image} alt={outfit.name} className="outfit-image" />
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
                                <p className="product-price">{product.price} DA</p>
                              </div>
                              <button className="view-product-btn" aria-label="Voir le produit">
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

                    <button className="toggle-products-btn" onClick={() => toggleExpand(outfit.id)}>
                      {expandedOutfit === outfit.id ? 'Masquer les produits' : 'Voir les produits'}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={expandedOutfit === outfit.id ? 'rotated' : ''}
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
