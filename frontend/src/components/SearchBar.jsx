import './SearchBar.css';

function SearchBar({ searchValue, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Cari produk..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="search-button" aria-label="Cari">
        Cari
      </button>
    </div>
  );
}

export default SearchBar;
