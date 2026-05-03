import { Link } from 'react-router-dom';
import './OrderSuccessPage.css';

function OrderSuccessPage() {
  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Pesanan Berhasil Dibuat!</h1>
        <p>Terima kasih telah berbelanja di Fashion Store. Pesanan Anda sedang menunggu verifikasi pembayaran oleh Admin.</p>
        
        <div className="success-actions">
          <Link to="/orders" className="btn-primary">Lihat Pesanan Saya</Link>
          <Link to="/" className="btn-secondary">Kembali Belanja</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
