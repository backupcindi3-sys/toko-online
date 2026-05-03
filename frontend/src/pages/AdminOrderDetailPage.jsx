import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/client';
import './AdminOrderDetailPage.css';

function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getById(id);
      setOrder(res.data.order);
      setError('');
    } catch (err) {
      setError('Gagal mengambil detail pesanan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await orderAPI.updateStatus(id, e.target.value);
      fetchOrderDetail(); // Refresh data
    } catch (err) {
      alert('Gagal update status');
    }
  };

  if (loading) {
    return (
      <div className="admin-order-detail-page">
        <div className="loading">Memuat Detail Pesanan...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-order-detail-page">
        <div className="error-message">{error || 'Pesanan tidak ditemukan'}</div>
        <button className="back-btn" onClick={() => navigate('/admin')}>Kembali ke Admin</button>
      </div>
    );
  }

  return (
    <div className="admin-order-detail-page">
      <div className="detail-container">
        <div className="detail-header">
          <div>
            <button className="back-btn" onClick={() => navigate('/admin')}>&larr; Kembali</button>
            <h1>Detail Pesanan</h1>
            <p className="order-id-label">ID Pesanan: {order._id}</p>
          </div>
          <div className="status-control">
            <label>Ubah Status: </label>
            <select 
              className={`status-select ${order.status}`}
              value={order.status}
              onChange={handleStatusChange}
            >
              <option value="pending_payment">Menunggu Pembayaran</option>
              <option value="paid">Dibayar</option>
              <option value="processing">Diproses</option>
              <option value="shipped">Dikirim</option>
              <option value="delivered">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Informasi Pelanggan</h3>
            <div className="info-row">
              <span>Nama Lengkap:</span>
              <strong>{order.shippingDetails?.fullName}</strong>
            </div>
            <div className="info-row">
              <span>No Telepon:</span>
              <strong>{order.shippingDetails?.phone}</strong>
            </div>
            <div className="info-row">
              <span>Alamat Pengiriman:</span>
              <p className="address-text">{order.shippingDetails?.address}</p>
            </div>
            <div className="info-row">
              <span>Waktu Pemesanan:</span>
              <strong>{new Date(order.createdAt).toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="detail-card">
            <h3>Daftar Produk</h3>
            <div className="product-list">
              {order.items.map(item => (
                <div key={item._id} className="product-item">
                  <img src={item.product?.image} alt={item.product?.name} />
                  <div className="product-info">
                    <h4>{item.product?.name}</h4>
                    <p>Kategori: {item.product?.category}</p>
                    <p>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="product-subtotal">
                    Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total Keseluruhan</span>
              <span className="total-amount">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
