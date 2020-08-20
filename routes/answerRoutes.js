const express = require('express');
const router = express.Router();
const {
  getAllAnswers,
  createAnswer,
  getAnswer,
  updateAnswer,
  deleteAnswer,
} = require('../controllers/answerController');
const { protect } = require('../controllers/authController');

router.route('/').get(getAllAnswers).post(protect, createAnswer);

router
  .route('/:id')
  .get(getAnswer)
  .patch(protect, updateAnswer)
  .delete(protect, deleteAnswer);

module.exports = router;
