const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
//router.get('/', reviewController.getAllReviews);

router.get('/getAllReviews', reviewController.getAllReviews);
router.get('/getYourReview', reviewController.getYourReview);
router.post('/createReview', reviewController.createReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
