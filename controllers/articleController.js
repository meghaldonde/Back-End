const Article = require('../models/articleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: {
      articles,
    },
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  const newArticle = await Article.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      article: newArticle,
    },
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError('No Article found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      article,
    },
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({
    $and: [{ _id: req.params.id }, { author: req.user.id }],
  });
  if (!article) {
    return next(
      new AppError(
        "No Article found with that ID , or you can't update this article",
        404
      )
    );
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    { _id: article._id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: 'success',
    data: {
      article: updatedArticle,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({
    $and: [{ _id: req.params.id }, { author: req.user.id }],
  });
  if (!article) {
    return next(
      new AppError(
        "No Article found with that ID , or you can't delete this article",
        404
      )
    );
  }

  await Article.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
