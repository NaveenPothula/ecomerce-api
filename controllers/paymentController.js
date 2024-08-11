const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/User');

console.log(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId }).populate(
    'products.product',
  );
  if (!cart) {
    return next(new AppError('No cart found for this user', 404));
  }

  cart.products.forEach((p) => {
    console.log(p.product.price);
  });

  // Create line items for Stripe checkout session
  const lineItems = cart.products.map((item) => ({
    price_data: {
      currency: 'inr', // Set your currency here
      product_data: {
        name: item.product.name,
        description: item.product.description,
      },
      unit_amount: item.product.price * 100, // Amount in cents
    },
    quantity: item.quantity,
  }));
  // console.log(cart.products);

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
    customer_email: req.user.email, // Assuming the user's email is available
    client_reference_id: cart.id,
    billing_address_collection: 'required',
    // Link session to the cart
  });

  res.status(200).json({
    status: 'success',
    sessionId: session.id,
    lineItems,
  });
});

const createOrder = async (lineItems, session) => {
  try {
    console.log(session);
    const user = await User.findOne({ email: session.customer_email });

    const order = await Order.create({
      user: user._id, // You might need to map this to your User schema
      checkout: lineItems, // Assuming you saved cartId in session metadata
      totalPrice: session.amount_total / 100, // Convert from cents to dollars
      paymentStatus: session.payment_status === 'paid' ? 'paid' : 'pending',
      paymentIntent: session.payment_intent, // Add payment intent
      sessionId: session.id, // Add session ID
      paymentDetails: {
        id: session.id,
        status: session.payment_status,
        paymentMethod: session.payment_method_types[0],
        amountReceived: session.amount_total / 100,
        createdAt: new Date(session.created * 1000), // Convert from Unix timestamp
      },
    });
  } catch (e) {
    console.log(e);
  }
};

exports.webookFunction = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      'whsec_6eea00b3f3247258103f6d8f472af0d93711f32e19e49d9f381121ad480d123c',
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Payment was successful
    console.log('Checkout session completed:', session);

    // Retrieve line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    createOrder(lineItems, session);

    // Create order
  }
  res.json({ received: true });
};
