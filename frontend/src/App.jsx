import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnalyticsTracker from './components/AnalyticsTracker';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AnalyticsTracker />
      <div className="app">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  </Routes>
                </main>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section">
              <h4>Tentang Kami</h4>
              <p>Fashion Store adalah toko online terpercaya yang menyediakan koleksi fashion terkini dengan kualitas premium untuk semua gaya Anda.</p>
              <div className="social-links">
                <a href="#facebook" aria-label="Facebook">f</a>
                <a href="#twitter" aria-label="Twitter">𝕏</a>
                <a href="#instagram" aria-label="Instagram">IG</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Kontak Kami</h4>
              <ul className="contact-list">
                <li>
                  <strong>Telepon:</strong>
                  <a href="tel:+62812345678">+62 812-3456-678</a>
                </li>
                <li>
                  <strong>Email:</strong>
                  <a href="mailto:info@fashionstore.com">info@fashionstore.com</a>
                </li>
                <li>
                  <strong>Alamat:</strong>
                  <span>Jl. Fashion No. 123, Jakarta Selatan 12345</span>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Tautan Cepat</h4>
              <ul className="quick-links">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#products">Produk</a></li>
                <li><a href="#about">Tentang Kami</a></li>
                <li><a href="#contact">Hubungi Kami</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Kebijakan</h4>
              <ul className="policy-links">
                <li><a href="#privacy">Kebijakan Privasi</a></li>
                <li><a href="#terms">Syarat & Ketentuan</a></li>
                <li><a href="#returns">Kebijakan Pengembalian</a></li>
                <li><a href="#shipping">Pengiriman</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Jam Operasional</h4>
              <ul className="hours-list">
                <li>Senin - Jumat</li>
                <li>09:00 - 18:00 WIB</li>
                <li className="separator"></li>
                <li>Sabtu - Minggu</li>
                <li>10:00 - 17:00 WIB</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Fashion Store. Semua hak cipta dilindungi.</p>
          </div>
        </footer>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
