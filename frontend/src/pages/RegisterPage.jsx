import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/client';
import './LoginPage.css'; // We can reuse the login page styles

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Daftar Akun</h1>
        <p className="login-subtitle">Bergabung dengan Fashion Store</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Pilih username"
              required
              disabled={loading}
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Buat password (min. 6 karakter)"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p className="login-hint" style={{ marginTop: '20px', textAlign: 'center' }}>
          Sudah punya akun? <Link to="/login" style={{ color: '#111', fontWeight: 'bold' }}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
