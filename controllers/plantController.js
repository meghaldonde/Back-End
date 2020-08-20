const multer = require('multer');
const Plant = require('../models/plantModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/plants');
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split('/')[1];
    //the name of the uploaded plant will be `plant-growerId-Date.now().extension`
    cb(null, `plant-${req.user.id}-${Date.now()}.${extension}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images!', 400), false);
  }
};

const upload = multer({
  fileFilter: multerFilter,
  storage: multerStorage,
});

exports.uploadPlantImages = upload.fields([{ name: 'images', maxCount: 5 }]);

exports.getAllPlants = catchAsync(async (req, res, next) => {
  const plants = await Plant.find();
  res.status(200).json({
    status: 'success',
    results: plants.length,
    data: {
      plants,
    },
  });
});

exports.createPlant = catchAsync(async (req, res, next) => {
  req.body.grower = req.user.id;
  if (req.files) {
    req.body.images = [];
    req.files.images.forEach((el) => {
      req.body.images.push(el.filename);
    });
  }
  const newPlant = await Plant.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      plant: newPlant,
    },
  });
});

exports.getPlant = catchAsync(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    return next(new AppError('No plant found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plant,
    },
  });
});

exports.updatePlant = catchAsync(async (req, res, next) => {
  if (req.files) {
    req.body.images = [];
    req.files.images.forEach((el) => {
      req.body.images.push(el.filename);
    });
  }

  const updatedPlant = await Plant.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedPlant) {
    return next(new AppError('No plant found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      plant: updatedPlant,
    },
  });
});

exports.deletePlant = catchAsync(async (req, res, next) => {
  const plant = await Plant.findOne({
    $and: [{ _id: req.params.id }, { grower: req.user.id }],
  });
  if (!plant) {
    return next(
      new AppError(
        "No plant found with that ID , or you can't delete this plant ",
        404
      )
    );
  }
  await Plant.findByIdAndDelete(plant.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
