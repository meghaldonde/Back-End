const express = require('express');

const {
  getAllArticleReviews,
  getArticleReview,
  createArticleReview,
  updateArticleReview,
  deleteArticleReview,
  setUserArticleIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllArticleReviews)
  .post(setUserArticleIds, createArticleReview);

router
  .route('/:id')
  .get(getArticleReview)
  .patch(updateArticleReview)
  .delete(deleteArticleReview);

module.exports = router;
