const mongoose = require("mongoose");
const NewsPost = require("../models/newsPostModel");
const { catchAsync } = require("../utils/catchError");

module.exports.createNewsPost = catchAsync(async (req, res) => {
  const newPost = new NewsPost({
    authorUsername: req.user.username,
    title: req.body.title,
    text: req.body.text,
    published: Date.now(),
    liked: [],
  });
  await newPost.save();
  res.status(200).json({
    status: "success",
  });
});
module.exports.getNewsPosts = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const skip = (page - 1) * limit;

  const totalCount = await NewsPost.find()
  const result = await NewsPost.find().skip(skip).limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      newsPosts: result,
      totalCount: totalCount.length
    },
  });
});
