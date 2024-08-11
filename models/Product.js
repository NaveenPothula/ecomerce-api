const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  brand: { type: String, required: true },
  ram: { type: String, required: true },
  rom: { type: String, required: true },
  battery: { type: String, required: true },
  os: { type: String, required: true },
  processor: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  averageRating: {
    type: Number,
    default: 4,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  },
  numberOfRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  colour: { type: String, required: true },
  display: { type: String, required: true },
});

ProductSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Set toObject and toJSON options to include virtuals
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
