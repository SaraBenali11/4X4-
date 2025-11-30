import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import ProductDetail from '../components/ProductDetail';
import image1 from '../../assets/images/image.png';
import image2 from '../../assets/images/img2.png';
import image3 from '../../assets/images/img3.png';

// Sample products data (same as in produits.jsx)
const productsData = [
  {
    id: 1,
    image: image1,
    name: 'Abaya Élégante Beige',
    category: 'Abaya',
    price: 8500,
    isNew: true,
    boutiques: 3,
    description: 'Une abaya élégante en tissu de qualité supérieure, parfaite pour toutes occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Noir', 'Blanc'],
    features: ['Tissu de qualité', 'Coupe moderne', 'Confortable', 'Lavable en machine'],
    availability: ['Alger Centre', 'Oran', 'Constantine']
  },
  {
    id: 2,
    image: image2,
    name: 'Robe Longue Crème',
    category: 'Robes',
    price: 6500,
    isNew: true,
    boutiques: 3,
    description: 'Robe longue élégante en couleur crème, idéale pour les sorties occasionnelles.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crème', 'Beige', 'Blanc'],
    features: ['Tissu fluide', 'Coupe ajustée', 'Douce au toucher', 'Polyvalent'],
    availability: ['Alger Centre', 'Annaba', 'Oran']
  },
  {
    id: 3,
    image: image3,
    name: 'Ensemble Chic Nude',
    category: 'Ensembles',
    price: 7200,
    isNew: false,
    boutiques: 3,
    description: 'Ensemble chic en couleur nude, parfaite pour un look moderne et élégant.',
    sizes: ['S', 'M', 'L'],
    colors: ['Nude', 'Beige', 'Rose pâle'],
    features: ['Ensemble coordonné', 'Style moderne', 'Confort quotidien', 'Qualité premium'],
    availability: ['Alger Centre', 'Constantine', 'Setif']
  },
  {
    id: 4,
    image: image1,
    name: 'Pantalon Denim Élégant',
    category: 'Pantalons',
    price: 5500,
    isNew: false,
    boutiques: 2,
    description: 'Pantalon denim élégant avec une coupe moderne et confortable.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bleu', 'Noir', 'Gris'],
    features: ['Denim de qualité', 'Coupe slim', 'Élastique', 'Résistant'],
    availability: ['Alger Centre', 'Oran']
  },
  {
    id: 5,
    image: image2,
    name: 'Haut Brodé Blanc',
    category: 'Hauts',
    price: 4200,
    isNew: true,
    boutiques: 3,
    description: 'Haut brodé blanc avec des détails délicats et élégants.',
    sizes: ['S', 'M', 'L'],
    colors: ['Blanc', 'Crème', 'Beige'],
    features: ['Broderie fine', 'Tissu léger', 'Style traditionnel', 'Confortable'],
    availability: ['Alger Centre', 'Constantine', 'Tlemcen']
  },
  {
    id: 6,
    image: image3,
    name: 'Ensemble Moderne Noir',
    category: 'Ensembles',
    price: 9200,
    isNew: false,
    boutiques: 2,
    description: 'Ensemble moderne en couleur noire, parfait pour un look sophistiqué.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Gris foncé', 'Marine'],
    features: ['Design moderne', 'Tissu premium', 'Coupe élégante', 'Polyvalent'],
    availability: ['Alger Centre', 'Oran']
  },
];

/**
 * Product detail page component
 * Displays detailed information about a specific product
 */
function Productdetpage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the product by ID
  const product = productsData.find(p => p.id === parseInt(id));

  const handleBack = () => {
    navigate('/produits');
  };

  return (
    <div className="homepage">
      <Header />
      <main>
        <ProductDetail product={product} onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}

export default Productdetpage;
