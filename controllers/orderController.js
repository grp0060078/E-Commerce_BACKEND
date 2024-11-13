// controllers/orderController.js

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// Place an order
const placeOrder = async (req, res) => {
  const { items } = req.body;

  try {
    const order = new Order({ user: req.user._id, totalAmount: 0 });
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        const price = product.price * item.quantity;
        totalAmount += price;

        const orderItem = new OrderItem({
          order: order._id,
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });

        await orderItem.save();
        product.stock -= item.quantity;
        await product.save();
      } else {
        return res.status(400).json({ message: `Product ${product.name} is out of stock` });
      }
    }

    order.totalAmount = totalAmount;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all orders for a user
const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View a single order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (order && order.user._id.equals(req.user._id)) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order by ID
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order && order.user._id.equals(req.user._id) && order.status === 'Pending') {
      await order.remove();
      res.json({ message: 'Order cancelled' });
    } else {
      res.status(400).json({ message: 'Order cannot be cancelled' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getOrderHistory, getOrder, cancelOrder };
