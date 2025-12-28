const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// Add to cart
router.post('/add', async (req, res) => {
  try {
    const { sessionId, productId, name, price, quantity = 1 } = req.body;
    
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({ sessionId, products: [] });
    }
    
    const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, name, price, quantity });
    }
    
    await cart.save();
    res.json({ success: true, message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

// Get cart
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId }).populate('products.productId');
    res.json({ success: true, cart: cart || { products: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;