import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }
    
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validasi produk
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }
    
    // Cek apakah item sudah ada di cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ message: 'Added to cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
       return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      res.json({ message: 'Cart updated', cart: populatedCart });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ message: 'Item removed from cart', cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};
