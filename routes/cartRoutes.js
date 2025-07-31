import express from 'express';
import Cart from '../models/cartModel.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Cart route working');
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
