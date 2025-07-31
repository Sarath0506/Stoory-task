import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
