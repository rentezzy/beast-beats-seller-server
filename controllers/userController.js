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
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});