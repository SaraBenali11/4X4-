import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ReviewsSection.css';
import ReviewCard from './reviewcards';
import { customerReviews } from '../../../database/data/mockData';

/**
 * Customer reviews section component
 * Displays testimonials from satisfied customers
 */
function ReviewsSection({
  title = 'Avis de Nos Clientes',
  subtitle = 'Découvrez ce que nos clientes disent de Boubaaya',
}) {
  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">{title}</h2>
        <p className="reviews-subtitle">{subtitle}</p>
      </div>

      <div className="reviews-grid">
        {customerReviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
    </section>
  );
}

ReviewsSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default ReviewsSection;
