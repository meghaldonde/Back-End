const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

const { protect } = require('../controllers/authController');

const reviewArticleRouter = require('./reviewArticleRoutes');
router.use('/:articleId/reviews/', reviewArticleRouter);
// "{{URL}}/api/v1/articles/:greenhouseId/reviews"

router.route('/').get(getAllArticles).post(protect, createArticle);

router
  .route('/:id')
  .get(getArticle)
  .patch(protect, updateArticle)
  .delete(protect, deleteArticle);

module.exports = router;
