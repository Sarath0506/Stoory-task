import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('User route working');
});

// Register new user (example)
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
