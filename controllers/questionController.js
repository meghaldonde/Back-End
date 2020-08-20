const Question = require('../models/questionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find();
  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions,
    },
  });
});

exports.createQuestion = catchAsync(async (req, res, next) => {
  req.body.asker = req.user.id;
  const newQuestion = await Question.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      question: newQuestion,
    },
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError('No Question found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      question,
    },
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findOne({
    $and: [{ _id: req.params.id }, { asker: req.user.id }],
  });
  if (!question) {
    return next(
      new AppError(
        "No question found with that ID , or you can't update this question ",
        404
      )
    );
  }

  const updatedQuestion = await Question.findByIdAndUpdate(
    { _id: question._id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: 'success',
    data: {
      question: updatedQuestion,
    },
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findOne({
    $and: [{ _id: req.params.id }, { asker: req.user.id }],
  });
  if (!question) {
    return next(
      new AppError(
        "No question found with that ID , or you can't delete this question ",
        404
      )
    );
  }

  await Question.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
