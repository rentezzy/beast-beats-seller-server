const mongoose = require("mongoose");
const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchError");

module.exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
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
