import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/client';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Default values
  const [shippingDetails, setShippingDetails] = useState({
    fullName: localStorage.getItem('username') || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      if (!res.data.cart || res.data.cart.items.length === 0) {
        alert('Keranjang Anda kosong');
        navigate('/');
      } else {
        setCart(res.data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
      alert('Gagal mengambil data keranjang');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    // Simpan data di state atau kirim ke halaman pembayaran
    navigate('/payment', { state: { shippingDetails, cart } });
  };

  if (loading) return <div className="checkout-page"><p>Loading...</p></div>;

  const totalAmount = cart?.items?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="order-summary">
            <h3>Ringkasan Pesanan</h3>
            <div className="summary-items">
              {cart?.items.map(item => (
                <div key={item.product._id} className="summary-item">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <strong>Total Pembayaran</strong>
              <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <form className="shipping-form" onSubmit={handleProceedToPayment}>
            <h3>Informasi Pengiriman</h3>
            
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                name="fullName" 
                value={shippingDetails.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input 
                type="tel" 
                name="phone" 
                value={shippingDetails.phone} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Alamat Lengkap</label>
              <textarea 
                name="address" 
                value={shippingDetails.address} 
                onChange={handleInputChange} 
                required 
                rows="4"
              ></textarea>
            </div>
            
            <button type="submit" className="proceed-btn">Lanjut ke Pembayaran</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
