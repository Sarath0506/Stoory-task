import express from 'express';
import Order from '../models/orderModel.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Order route working');
});

// Place new order
router.post('/place', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
