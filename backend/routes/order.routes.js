const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus, getMyOrders } = require('../controllers/order.controller');
const { protect, vendor } = require('../middlewares/auth.middleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, vendor, updateOrderStatus);

module.exports = router;
