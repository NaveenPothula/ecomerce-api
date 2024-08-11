const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.use(authController.protect);

router.post('/modifyCart', cartController.addProduct);
router.delete('/removeProduct', cartController.removeProduct);
router.get('/getCart', cartController.getCart);
module.exports = router;
