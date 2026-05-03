import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/profile')
};

export const productAPI = {
  getAll: () => apiClient.get('/api/products'),
  getById: (id) => apiClient.get(`/api/products/${id}`),
  create: (productData) => apiClient.post('/api/products', productData),
  update: (id, productData) => apiClient.put(`/api/products/${id}`, productData),
  delete: (id) => apiClient.delete(`/api/products/${id}`)
};

// Cart
export const cartAPI = {
  get: () => apiClient.get('/api/cart'),
  add: (productId, quantity = 1) => apiClient.post('/api/cart/add', { productId, quantity }),
  update: (productId, quantity) => apiClient.put(`/api/cart/update/${productId}`, { quantity }),
  remove: (productId) => apiClient.delete(`/api/cart/remove/${productId}`),
  clear: () => apiClient.delete('/api/cart/clear')
};

// Orders
export const orderAPI = {
  create: (shippingDetails) => apiClient.post('/api/orders', { shippingDetails }),
  getUserOrders: () => apiClient.get('/api/orders'),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  // Admin only
  getAllOrders: () => apiClient.get('/api/orders/admin/all'),
  updateStatus: (id, status) => apiClient.put(`/api/orders/admin/${id}/status`, { status })
};

export default apiClient;
