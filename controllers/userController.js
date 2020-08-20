const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');

//Save photo in memoryStorage as buffer
const multerStorage = multer.memoryStorage();

//multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // name of user photo will be user-userId-curent_date (to avoid same name of users photos)
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`img/users/${req.file.filename}`);

  next();
});

const filterRequestObj = async (reqBodyObj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(reqBodyObj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = reqBodyObj[el];
  });
  return filteredObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //To avoid that a malicious user change his role to an admin and grant all the access to the app
  const filteredBody = await filterRequestObj(req.body, 'name', 'email', 'bio');
  //Save image name to the database
  if (req.file) filteredBody.photo = req.file.filename;
  // we use req.user from the protect middellware
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
