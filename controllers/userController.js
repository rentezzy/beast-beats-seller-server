const fs = require("fs");
const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = performance.now();
  req.file.dbname = filename;

  const folderName = `public/img/${req.user._id}`;

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  await sharp(req.file.buffer)
    .resize(256, 256)
    .toFormat("png")
    .toFile(`public/img/${req.user._id}/${filename}-small.png`);

  await sharp(req.file.buffer)
    .resize(512, 512)
    .toFormat("png")
    .toFile(`public/img/${req.user._id}/${filename}-big.png`);
  next();
});

module.exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.avatar = req.file.dbname;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
  });
});

module.exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
module.exports.getArtists = catchAsync(async (req, res) => {
  const users = await User.find({ role: "artist" });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.logOut = catchAsync(async (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).json({
    status: "success",
  });
});
exports.toggleCart = catchAsync(async (req, res) => {
  const song = req.params.id;
  const user = await User.findById(req.user._id);
  const inCart = user.cart.includes(song);
  if (inCart) {
    user.cart.splice(user.cart.indexOf(song), 1);
    await user.save();
  } else {
    user.cart.push(song);
    await user.save();
  }
  res.status(200).json({
    status: "success",
  });
});
