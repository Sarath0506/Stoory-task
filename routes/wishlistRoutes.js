import express from 'express';
import Wishlist from '../models/wishlistModel.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Wishlist route working');
});

// Add item to wishlist
router.post('/add', async (req, res) => {
  try {
    const wishlist = await Wishlist.create(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
