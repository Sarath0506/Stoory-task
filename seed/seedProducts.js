import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";

dotenv.config();
await connectDB();

const products = [
  {
    name: "iPhone 15",
    price: 999,
    brand: "Apple",
    category: "Electronics",
    description: "Latest Apple iPhone 15",
    countInStock: 10,
    image: "/images/iphone.jpg"
  },
  {
    name: "Samsung TV",
    price: 499,
    brand: "Samsung",
    category: "Electronics",
    description: "Smart 4K LED TV",
    countInStock: 5,
    image: "/images/samsungtv.jpg"
  },
];

try {
  await Product.deleteMany();
  const created = await Product.insertMany(products);
  console.log("✅ Products seeded:", created);
  process.exit();
} catch (err) {
  console.error("❌ Error seeding products:", err);
  process.exit(1);
}
