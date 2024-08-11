const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('./models/Order');

const app = express();

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const paymentController = require('./controllers/paymentController');
const User = require('./models/User');

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTp headers
app.use(cors());
app.options('*', cors());

// Developmet logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  paymentController.webookFunction,
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Test middleware
app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/payment', paymentRouter);
// 3) ROUTES

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
