const Greenhouse = require('../models/greenhouseModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllGreenhouses = catchAsync(async (req, res, next) => {
  const greenhouses = await Greenhouse.find()
    .populate({ path: 'grower', select: '-__v -passwordChangedAt' })
    .populate({ path: 'plants', select: '-__v' });
  res.status(200).json({
    status: 'success',
    results: greenhouses.length,
    data: {
      greenhouses,
    },
  });
});

exports.createGreenhouse = catchAsync(async (req, res, next) => {
  req.body.grower = req.user.id;
  const newGreenhouse = await Greenhouse.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      greenhouse: newGreenhouse,
    },
  });
});

exports.getGreenhouse = catchAsync(async (req, res, next) => {
  const greenhouse = await Greenhouse.findById(req.params.id)
    .populate({ path: 'grower', select: '-__v -passwordChangedAt' })
    .populate({ path: 'plants', select: '-__v' });

  if (!greenhouse) {
    return next(new AppError('No Greenhouse found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      greenhouse,
    },
  });
});

exports.updateGreenhouse = catchAsync(async (req, res, next) => {
  const greenhouse = await Greenhouse.findOne({
    $and: [{ _id: req.params.id }, { grower: req.user.id }],
  });
  if (!greenhouse) {
    return next(
      new AppError(
        "No Greenhouse found with that ID , or you can't update this Greenhouse ",
        404
      )
    );
  }

  const updatedGreenhouse = await Greenhouse.findByIdAndUpdate(
    { _id: greenhouse.id },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: 'success',
    data: {
      greenhouse: updatedGreenhouse,
    },
  });
});

exports.deleteGreenhouse = catchAsync(async (req, res, next) => {
  const greenhouse = await Greenhouse.findOne({
    $and: [{ _id: req.params.id }, { grower: req.user.id }],
  });
  if (!greenhouse) {
    return next(
      new AppError(
        "No plant found with that ID , or you can't delete this Greenhouse ",
        404
      )
    );
  }
  await Greenhouse.findByIdAndDelete(greenhouse._id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
