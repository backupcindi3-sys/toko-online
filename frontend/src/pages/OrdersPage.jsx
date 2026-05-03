import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../api/client';
import './OrdersPage.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getUserOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending_payment': { label: 'Menunggu Pembayaran', className: 'status-pending' },
      'paid': { label: 'Dibayar', className: 'status-paid' },
      'processing': { label: 'Diproses', className: 'status-processing' },
      'shipped': { label: 'Dikirim', className: 'status-shipped' },
      'delivered': { label: 'Selesai', className: 'status-delivered' },
      'cancelled': { label: 'Dibatalkan', className: 'status-cancelled' }
    };
    const mapped = statusMap[status] || { label: status, className: '' };
    return <span className={`status-badge ${mapped.className}`}>{mapped.label}</span>;
  };

  if (loading) return <div className="orders-page"><p>Loading...</p></div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Pesanan Saya</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Anda belum memiliki pesanan.</p>
            <Link to="/products" className="btn-primary">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="order-id">ID: {order._id}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item._id} className="order-item">
                      <img src={item.product?.image} alt={item.product?.name} />
                      <div className="item-details">
                        <h4>{item.product?.name}</h4>
                        <p>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="total-amount">
                    <span>Total Belanja:</span>
                    <strong>Rp {order.totalAmount.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
