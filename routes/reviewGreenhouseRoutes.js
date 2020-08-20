const express = require('express');

const {
  getAllGreenhouseReviews,
  getGreenhouseReview,
  createGreenhouseReview,
  updateGreenhouseReview,
  deleteGreenhouseReview,
  setUserGreenhouseIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllGreenhouseReviews)
  .post(setUserGreenhouseIds, createGreenhouseReview);

router
  .route('/:id')
  .get(getGreenhouseReview)
  .patch(updateGreenhouseReview)
  .delete(deleteGreenhouseReview);

module.exports = router;
