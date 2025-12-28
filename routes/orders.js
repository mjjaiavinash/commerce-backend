const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Place order
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, address, products, totalAmount } = req.body;
    
    const order = new Order({
      customerName,
      email,
      phone,
      address,
      products,
      totalAmount
    });
    
    await order.save();
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;