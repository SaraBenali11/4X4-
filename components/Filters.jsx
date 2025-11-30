import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/Filters.css';

export default function FilterBar({ onFilterChange, initialFilters }) {
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || 'Tous');
  const [selectedPrice, setSelectedPrice] = useState(initialFilters?.price || 'Tous');
  const [sortBy, setSortBy] = useState(initialFilters?.sort || 'Nouveautés');

  useEffect(() => {
    if (initialFilters) {
      setSelectedCategory(initialFilters.category || 'Tous');
      setSelectedPrice(initialFilters.price || 'Tous');
      setSortBy(initialFilters.sort || 'Nouveautés');
    }
  }, [initialFilters]);

  const categories = ['Tous', 'Abaya', 'Robes', 'Ensembles', 'Hauts', 'Pantalons'];
  const priceRanges = ['Tous', 'Moins de 6000 DA', '6000 - 8000 DA', 'Plus de 8000 DA'];
  const sortOptions = ['Nouveautés', 'Prix croissant', 'Prix décroissant', 'Nom A-Z'];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange?.({ category, price: selectedPrice, sort: sortBy });
  };

  const handlePriceChange = (price) => {
    setSelectedPrice(price);
    onFilterChange?.({ category: selectedCategory, price, sort: sortBy });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    onFilterChange?.({ category: selectedCategory, price: selectedPrice, sort: newSort });
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        <h2>Filtres</h2>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Catégorie</h3>
        <div className="filter-options">
          {categories.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="radio-custom"></span>
              <span className="filter-label">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Prix</h3>
        <div className="filter-options">
          {priceRanges.map((price) => (
            <label key={price} className="filter-option">
              <input
                type="radio"
                name="price"
                value={price}
                checked={selectedPrice === price}
                onChange={() => handlePriceChange(price)}
              />
              <span className="radio-custom"></span>
              <span className="filter-label">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Trier par</h3>
        <select className="filter-select" value={sortBy} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  onFilterChange: PropTypes.func,
  initialFilters: PropTypes.shape({
    category: PropTypes.string,
    price: PropTypes.string,
    sort: PropTypes.string,
  }),
};
