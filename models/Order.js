const mongoose = require('mongoose');
const { checkout } = require('../app');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user'],
  },
  checkout: {
    type: Array,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Order must have a total price'],
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentDetails: {
    id: String,
    status: String,
    paymentMethod: String,
    amountReceived: Number,
    createdAt: Date,
  },
  paymentIntent: {
    type: String,
    required: [true, 'Order must have a payment intent'],
  },
  sessionId: {
    type: String,
    required: [true, 'Order must have a session ID'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
