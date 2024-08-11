const Cart = require('../models/Cart');
//const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity, price } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and userId is available

  // Fetch the product to get its price

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // If no cart exists for the user, create a new one
    cart = new Cart({
      user: userId,
      products: [],
      totalPrice: 0,
    });
  }

  // Check if the product already exists in the cart
  const existingProductIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (existingProductIndex > -1) {
    // If product exists, update the quantity and price
    const productPrice = cart.products[existingProductIndex].quantity * price;
    cart.totalPrice -= productPrice;
    cart.products[existingProductIndex].quantity = quantity;
  } else {
    // If product doesn't exist, add it to the cart
    cart.products.push({
      product: productId,
      quantity: quantity,
      price: price,
    });
  }

  // Update the total price of the cart
  cart.totalPrice += price * quantity;

  // Save the cart
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and userId is available

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  // Find the index of the product in the cart
  const productIndex = cart.products.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (productIndex === -1) {
    return next(new AppError('Product not found in cart', 404));
  }

  // Remove the product from the cart
  cart.products.splice(productIndex, 1);

  // Recalculate the total price of the cart
  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'products.product',
  );

  if (!cart) {
    return next(new AppError('cart not found', 404));
  }
  res.status(200).json({
    status: 'success',
    cart,
  });
});
