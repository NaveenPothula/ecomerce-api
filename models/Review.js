const mongoose = require('mongoose');

const Product = require('./Product');

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to update product's average rating after saving a review
ReviewSchema.post('save', async function () {
  const review = this;
  try {
    const reviews = await mongoose
      .model('Review')
      .find({ product: review.product });
    const numberOfRatings = reviews.length;
    const averageRating =
      numberOfRatings > 0
        ? reviews.reduce((acc, thing) => acc + thing.rating, 0) /
          numberOfRatings
        : 0;

    await mongoose
      .model('Product')
      .findByIdAndUpdate(review.product, { averageRating, numberOfRatings });
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
});

ReviewSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    try {
      const reviews = await mongoose
        .model('Review')
        .find({ product: doc.product });
      const numberOfRatings = reviews.length;
      const averageRating =
        numberOfRatings > 0
          ? reviews.reduce((acc, thing) => acc + thing.rating, 0) /
            numberOfRatings
          : 0;

      await mongoose
        .model('Product')
        .findByIdAndUpdate(doc.product, { averageRating, numberOfRatings });
    } catch (error) {
      console.error('Error updating average rating after delete:', error);
    }
  }
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
