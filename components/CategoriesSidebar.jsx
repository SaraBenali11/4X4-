// src/components/CategoriesSidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Sidebar.css';

export default function CategoriesSidebar({ categories = [], onSelect = () => {}, onClose }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h4>Catégories</h4>
        {onClose && (
          <button className="close-x" onClick={onClose} aria-label="close">
            ✕
          </button>
        )}
      </div>

      <ul className="cat-list">
        {categories.map((c) => (
          <li key={c.name} className="cat-item" onClick={() => onSelect(c.name)}>
            <div>
              <div className="cat-name">{c.name}</div>
              <div className="cat-count">{c.count} produits</div>
            </div>
            <div className="chev">›</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

CategoriesSidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
