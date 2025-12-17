const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const User = require('../models/User');
const Contact = require('../models/Contact');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check hardcoded admin first
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        success: true,
        message: 'Admin login successful'
      });
    }

    // Check database admins
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (isValidPassword) {
        return res.json({
          success: true,
          message: 'Admin login successful'
        });
      }
    }

    res.status(400).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    let products = await Product.find();
    
    // If no products exist, create sample products
    if (products.length === 0) {
      const sampleProducts = [
        { name: 'Glow Face Cream', price: 599, category: 'skincare', image: 'images/face-cream.webp', stock: 25, description: 'Moisturizing glow face cream' },
        { name: 'Moisturizer', price: 399, category: 'skincare', image: 'images/moisturizer.webp', stock: 30, description: 'Daily moisturizer for all skin types' },
        { name: 'Liquid Foundation', price: 299, category: 'makeup', image: 'images/liquid.jpg', stock: 35, description: 'Full coverage liquid foundation' },
        { name: 'Mascara', price: 399, category: 'makeup', image: 'images/mascara.webp', stock: 45, description: 'Volumizing mascara' },
        { name: 'Shampoo', price: 299, category: 'haircare', image: 'images/shampoo.webp', stock: 40, description: 'Gentle cleansing shampoo' },
        { name: 'Hair Conditioner', price: 349, category: 'haircare', image: 'images/conditioner.webp', stock: 35, description: 'Deep conditioning treatment' },
        { name: 'Rose Perfume', price: 450, category: 'perfume', image: 'images/perfume1.jpg', stock: 15, description: 'Elegant rose fragrance' },
        { name: 'Luxury Perfume', price: 899, category: 'perfume', image: 'images/perfume2.jpg', stock: 10, description: 'Premium luxury scent' }
      ];
      
      await Product.insertMany(sampleProducts);
      products = await Product.find();
    }
    
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find().select('-password');
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new admin
router.post('/admins', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new admin
    const admin = new Admin({
      username,
      password: hashedPassword
    });
    
    await admin.save();
    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete admin
router.delete('/admins/:id', async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;