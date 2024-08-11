const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Review = require('../models/Review');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const reviews = await Review.find({ product: id });

  if (!reviews) {
    return next(new AppError('reviews not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.getYourReview = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const product = req.params.id;

  const review = await Review.find({ user: id, product: product });

  if (!review) {
    return next(new AppError('you have not given review', 404));
  }
  res.status(200).json({
    status: 200,
    data: { review },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const { product, rating, comment } = req.body;

  const review = await Review.create({ user: id, product, rating, comment });

  if (!review) {
    return next(new AppError('review not added'));
  }
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { rating, comment } = req.body;
  const review = await Review.findByIdAndUpdate(
    id,
    { rating: rating, comment: comment },
    { new: true },
  );

  if (!review) {
    return next(new AppError('review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('review not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { review },
  });
});
