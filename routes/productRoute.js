const express = require('express');

const productController = require('../controllers/productController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:id/reviews', reviewRouter);

router.post('/createProduct', productController.createProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/:id', productController.getProduct);

module.exports = router;
