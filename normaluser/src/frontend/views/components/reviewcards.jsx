import React from 'react';
import PropTypes from 'prop-types';
import { generateArray } from '../../utils/formatters';
import { RATING_CONFIG } from '../../config/constants';

/**
 * Individual review card component
 * Displays customer testimonial with rating and avatar
 */
function ReviewCard({ text, name, city, avatar, rating = RATING_CONFIG.DEFAULT_RATING }) {
  return (
    <article className="review-card">
      <div className="review-quote-icon" aria-hidden="true">
        ❞
      </div>

      <div className="review-stars" role="img" aria-label={`${rating} out of ${RATING_CONFIG.MAX_STARS} stars`}>
        {generateArray(RATING_CONFIG.MAX_STARS).map((_, index) => (
          <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
      </div>

      <p className="review-text">"{text}"</p>

      <div className="review-footer">
        <img className="review-avatar" src={avatar} alt={`${name}'s avatar`} loading="lazy" />
        <div>
          <div className="review-name">{name}</div>
          <div className="review-city">{city}</div>
        </div>
      </div>
    </article>
  );
}

ReviewCard.propTypes = {
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  rating: PropTypes.number,
};

export default ReviewCard;