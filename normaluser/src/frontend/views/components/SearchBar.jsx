const SearchBar = ({ value, onChange, count }) => {
  return (
    <div className="search-box">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Rechercher une tenue..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Rechercher une tenue"
        />
      </div>
      <p className="search-count">{count} tenues trouvées</p>
    </div>
  );
};

export default SearchBar;
