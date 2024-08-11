const mongoose = require('mongoose');

const ProductItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Cart item must belong to a product'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify the quantity'],
    min: [1, 'Quantity can not be less than 1'],
  },
  price: {
    type: Number,
    required: [true, 'Please specify the price of the item'],
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a user'],
  },
  products: [ProductItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    required: [true, 'Cart must have a total price'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
