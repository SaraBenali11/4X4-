import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import '../styles/nouveautesection.css';
import { newProducts } from '../../../database/data/mockData';

/**
 * New arrivals section component
 * Displays featured new products in a grid layout
 */
function NewArrivals({
  title = 'Nouveautés',
  subtitle = 'Découvrez nos dernières créations, alliant tradition et modernité',
}) {
  return (
    <section className="nouveautes-section">
      <div className="nouveautes-container">
        <div className="nouveautes-header">
          <h2 className="nouveautes-title">{title}</h2>
          <p className="nouveautes-subtitle">{subtitle}</p>
        </div>

        <div className="nouveautes-grid">
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              oldPrice={product.oldPrice}
              isNew={product.isNew}
              productId={product.id}
            />
          ))}
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
