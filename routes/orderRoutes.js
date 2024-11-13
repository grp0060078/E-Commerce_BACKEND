const express = require('express');
const { placeOrder, getOrderHistory, getOrder, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getOrderHistory);
router.get('/:id', protect, getOrder);
router.delete('/:id', protect, cancelOrder);

module.exports = router;
