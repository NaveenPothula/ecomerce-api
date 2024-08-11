const express = require('express');
const authController = require('../controllers/authControllers');

const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.use(authController.protect);

router.get('/getCheckout', paymentController.createCheckoutSession);

module.exports = router;
