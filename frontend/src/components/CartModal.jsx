import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/client';
import './CartModal.css';

function CartModal({ isOpen, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      setLoading(true);
      const res = await cartAPI.update(productId, quantity);
      setCart(res.data.cart);
    } catch (error) {
      console.error('Failed to update cart', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      const res = await cartAPI.remove(productId);
      setCart(res.data.cart);
    } catch (error) {
      console.error('Failed to remove item', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  const totalAmount = cart?.items?.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Keranjang Belanja</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-modal-body">
          {loading && !cart ? (
            <p>Loading...</p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="empty-cart">
              <p>Keranjang Anda kosong</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p className="price">Rp {item.product.price.toLocaleString('id-ID')}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.product._id)}>Hapus</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="cart-modal-footer">
            <div className="total-section">
              <span>Total:</span>
              <span className="total-price">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModal;
