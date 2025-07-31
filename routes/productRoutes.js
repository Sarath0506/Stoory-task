import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Product route working');
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
