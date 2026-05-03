import { useState, useEffect, useMemo } from 'react';
import { productAPI } from '../api/client';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import './ProductListPage.css';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.products || []);
      setError('');
    } catch (err) {
      setError('Gagal mengambil data produk: ' + (err.response?.data?.message || err.message));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Semua', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchValue, selectedCategory]);

  return (
    <div className="product-list-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Daftar Produk</h1>
          <p>Temukan produk fashion pilihan Anda</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!loading && (
          <>
            <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

            <div className="filter-section">
              <h3>Filter Kategori</h3>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category || (selectedCategory === '' && category === 'Semua') ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category === 'Semua' ? '' : category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="results-info">
              <p>Menampilkan {filteredProducts.length} produk</p>
            </div>

            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="no-results">
                  <p>Tidak ada produk yang ditemukan untuk pencarian Anda</p>
                  <p>Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="loading">
            <p>Memuat produk...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
