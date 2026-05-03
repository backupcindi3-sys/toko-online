import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/client';
import './PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { shippingDetails, cart } = location.state || {};

  if (!shippingDetails || !cart) {
    navigate('/checkout');
    return null;
  }

  const totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      await orderAPI.create(shippingDetails);
      navigate('/order-success');
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Gagal membuat pesanan: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Pembayaran</h1>
        <p className="payment-instructions">Silakan scan QR Code di bawah ini untuk melakukan pembayaran sejumlah:</p>
        <h2 className="payment-amount">Rp {totalAmount.toLocaleString('id-ID')}</h2>
        
        <div className="qr-code-container">
          {/* Dummy QR Code using a placeholder image service */}
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAYMENT_FASHION_STORE_${totalAmount}`} 
            alt="QR Code Pembayaran" 
            className="qr-code"
          />
        </div>

        <p className="payment-warning">Jika Anda sudah melakukan pembayaran, silakan klik tombol di bawah.</p>
        
        <button 
          className="paid-btn" 
          onClick={handlePaymentSuccess}
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Saya Sudah Bayar'}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
