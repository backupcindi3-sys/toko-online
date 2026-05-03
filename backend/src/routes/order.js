import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// User routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes
router.get('/admin/all', verifyAdmin, getAllOrders);
router.put('/admin/:id/status', verifyAdmin, updateOrderStatus);

export default router;
