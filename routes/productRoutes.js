const express = require('express');
const { getAllProducts, getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, addProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
