import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from './CartModal';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          FASHION STORE
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Beranda</Link>
          <Link to="/products" className="nav-link">Produk</Link>
          {token ? (
            <div className="auth-section">
              <span className="username">Hi, {username}</span>
              <button className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '16px', padding: 0}} onClick={() => setIsCartOpen(true)}>Keranjang</button>
              <Link to="/orders" className="nav-link">Pesanan Saya</Link>
              {role === 'admin' && (
                <Link to="/admin" className="nav-link admin">Admin</Link>
              )}
              <button className="logout-link" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="nav-link admin">Login</Link>
          )}
        </nav>
      </div>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}

export default Header;
