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

  const totalCount = await NewsPost.find();
  const result = await NewsPost.find()
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      newsPosts: result,
      totalCount: totalCount.length,
    },
  });
});

module.exports.toggleLikeNewsPost = catchAsync(async (req, res) => {
  const post = await NewsPost.findById(req.query._id);
  const isLiked = post.liked.includes(req.user._id);
  if (isLiked) {
    post.liked.splice(post.liked.indexOf(req.user._id), 1);
    await post.save();
  } else {
    post.liked.push(req.user._id);
    await post.save();
  }
  res.status(200).json({
    status: "success",
  });
});
