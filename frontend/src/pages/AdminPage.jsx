import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../api/client';
import './AdminPage.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kemeja',
    price: '',
    image: '',
    description: '',
    color: '',
    size: '',
    stock: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAllOrders();
      setOrders(res.data.orders);
      setError('');
    } catch (err) {
      setError('Gagal mengambil pesanan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.products);
      setError('');
    } catch (err) {
      setError('Gagal mengambil produk: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        size: formData.size.split(',').map(s => s.trim())
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
      } else {
        await productAPI.create(payload);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Kemeja',
        price: '',
        image: '',
        description: '',
        color: '',
        size: '',
        stock: ''
      });
      fetchProducts();
    } catch (err) {
      setError('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      color: product.color,
      size: product.size.join(', '),
      stock: product.stock.toString()
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus produk ini?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError('Gagal hapus: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Kemeja',
      price: '',
      image: '',
      description: '',
      color: '',
      size: '',
      stock: ''
    });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="admin-menu">
          <li>
            <button 
              className={activeTab === 'products' ? 'active' : ''}
              onClick={() => setActiveTab('products')}
            >
              Kelola Produk
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'transactions' ? 'active' : ''}
              onClick={() => setActiveTab('transactions')}
            >
              Kelola Transaksi
            </button>
          </li>
          <li style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <button onClick={() => navigate('/')}>
              Kembali ke Toko
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-topbar">
          <span className="admin-user">Halo, {localStorage.getItem('username')}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <main className="admin-main">
          {activeTab === 'products' ? (
            <>
              <div className="admin-toolbar">
          <h2>Kelola Produk</h2>
          {!showForm && (
            <button className="add-btn" onClick={() => setShowForm(true)}>
              + Tambah Produk
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nama Produk *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Kategori *</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Kemeja">Kemeja</option>
                  <option value="Celana">Celana</option>
                  <option value="Dress">Dress</option>
                  <option value="Jaket">Jaket</option>
                  <option value="Blouse">Blouse</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Sweater">Sweater</option>
                  <option value="Skirt">Skirt</option>
                  <option value="Polo">Polo</option>
                  <option value="Cardigan">Cardigan</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Harga (Rp) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stok *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Warna *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Contoh: Merah, Biru, dll"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ukuran (pisahkan dengan koma) *</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="S, M, L, XL"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL Gambar *</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="form-group">
              <label>Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Batal
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Warna</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty">Belum ada produk</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>Rp{product.price.toLocaleString('id-ID')}</td>
                      <td>{product.color}</td>
                      <td>{product.stock}</td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
          </>
        ) : (
          <>
            <div className="admin-toolbar">
              <h2>Kelola Transaksi</h2>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
              <div className="loading">Memuat Data Transaksi...</div>
            ) : (
              <div className="admin-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID Pesanan</th>
                      <th>Pembeli</th>
                      <th>Total Belanja</th>
                      <th>Status Pesanan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="5" className="empty">Belum ada transaksi</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order._id}>
                          <td style={{ fontFamily: 'monospace' }}>{order._id.substring(order._id.length - 8)}</td>
                          <td>
                            <strong>{order.user?.username || 'Unknown'}</strong>
                            <br />
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>{order.shippingDetails?.phone}</span>
                          </td>
                          <td style={{ fontWeight: '600' }}>Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                          <td>
                            <select 
                              className={`status-select ${order.status}`}
                              value={order.status}
                              onChange={async (e) => {
                                try {
                                  await orderAPI.updateStatus(order._id, e.target.value);
                                  fetchOrders();
                                } catch (err) {
                                  alert('Gagal update status');
                                }
                              }}
                            >
                              <option value="pending_payment">Menunggu Pembayaran</option>
                              <option value="paid">Dibayar</option>
                              <option value="processing">Diproses</option>
                              <option value="shipped">Dikirim</option>
                              <option value="delivered">Selesai</option>
                              <option value="cancelled">Dibatalkan</option>
                            </select>
                          </td>
                          <td>
                            <button className="detail-btn" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                              Detail Pesanan
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        </main>
      </div>
    </div>
  );
}
