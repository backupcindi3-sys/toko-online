import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingDetails } = req.body;
    
    if (!shippingDetails || !shippingDetails.address || !shippingDetails.phone || !shippingDetails.fullName) {
      return res.status(400).json({ message: 'Shipping details are required' });
    }

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and calculate total
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      });
    }

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Create Order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingDetails,
      status: 'pending_payment'
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check ownership unless admin
    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// ADMIN ONLY ROUTES
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
