import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../api/client';
import RatingComponent from '../components/RatingComponent';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const productData = response.data.product;
      setProduct(productData);

      // Fetch semua produk untuk mendapatkan related products
      const allProductsResponse = await productAPI.getAll();
      const related = allProductsResponse.data.products
        .filter(p => p.category === productData.category && p._id !== productData._id)
        .slice(0, 3);
      setRelatedProducts(related);
      setError('');
    } catch (err) {
      setError('Gagal mengambil detail produk: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="page-container">
          <div className="loading">Memuat produk...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="page-container">
          <div className="not-found">
            <h2>Produk tidak ditemukan</h2>
            <p>{error || 'Maaf, produk yang Anda cari tidak ada'}</p>
            <Link to="/products" className="back-button">
              Kembali ke Daftar Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="page-container">
        <button className="back-button-simple" onClick={() => navigate(-1)}>
          Kembali
        </button>

        <div className="product-detail-container">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="product-detail-image" />
          </div>

          <div className="product-details-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-category-badge">{product.category}</div>

            <div className="rating-section">
              <RatingComponent rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="price-section">
              <span className="price">Rp {product.price.toLocaleString('id-ID')}</span>
            </div>

            <div className="description-section">
              <h3>Deskripsi Produk</h3>
              <p>{product.description}</p>
            </div>

            <div className="details-section">
              <h3>Detail Produk</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Warna</span>
                  <span className="detail-value">{product.color}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ukuran</span>
                  <span className="detail-value">{Array.isArray(product.size) ? product.size.join(', ') : product.size}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stok</span>
                  <span className="detail-value">{product.stock} unit</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={async () => {
                  if (!localStorage.getItem('token')) {
                    alert('Silakan login terlebih dahulu');
                    navigate('/login');
                    return;
                  }
                  try {
                    setAddingToCart(true);
                    await cartAPI.add(product._id, 1);
                    alert('Produk ditambahkan ke keranjang');
                  } catch (err) {
                    alert('Gagal menambahkan ke keranjang');
                  } finally {
                    setAddingToCart(false);
                  }
                }}
                disabled={addingToCart}
              >
                {addingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
              
              <button 
                className="btn-secondary"
                onClick={async () => {
                  if (!localStorage.getItem('token')) {
                    alert('Silakan login terlebih dahulu');
                    navigate('/login');
                    return;
                  }
                  try {
                    setAddingToCart(true);
                    await cartAPI.add(product._id, 1);
                    navigate('/checkout');
                  } catch (err) {
                    alert('Gagal menambahkan ke keranjang');
                  } finally {
                    setAddingToCart(false);
                  }
                }}
                disabled={addingToCart}
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Produk Sejenis Lainnya</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h4>{relatedProduct.name}</h4>
                    <p className="related-product-price">Rp {relatedProduct.price.toLocaleString('id-ID')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
