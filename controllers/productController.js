const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Product = require('../models/Product');
//const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    model,
    brand,
    ram,
    rom,
    battery,
    os,
    processor,
    price,
    description,
    images,
    seller,
    colour,
    display,
  } = req.body;

  const product = new Product({
    name,
    model,
    brand,
    ram,
    rom,
    battery,
    os,
    processor,
    price,
    description,
    images,
    seller,
    colour,
    display,
  });

  await product.save();

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  if (!products) {
    return next(new AppError('products not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate('reviews');

  if (!product) {
    return next(new AppError('product not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

//exports.getAllProducts = catchAsync(async (req, res, next) => {});
