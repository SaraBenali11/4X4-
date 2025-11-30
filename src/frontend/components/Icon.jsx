import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Icon wrapper component
 * Provides consistent sizing and styling for SVG icons
 */
function Icon({ children, size = 24, className = '', ariaLabel }) {
  return (
    <span
      className={`icon ${className}`}
      style={{ width: size, height: size, display: 'inline-flex' }}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {children}
    </span>
  );
}

Icon.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Icon;