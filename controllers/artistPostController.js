const mongoose = require("mongoose");
const ArtistPost = require("../models/artistPostModel");
const ArtistPostReply = require("../models/artistPostReplyModel");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchError");

module.exports.createArtistPost = catchAsync(async (req, res) => {
  const newPost = new ArtistPost({
    author: req.user._id,
    originTo: req.user._id,
    text: req.body.text,
    published: Date.now(),
    liked: [],
    replyes: 0,
  });
  await newPost.save();
  res.status(200).json({
    status: "success",
  });
});

module.exports.getArtistPosts = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const totalCount = await ArtistPost.find({ originTo: req.params.id });
  const result = await ArtistPost.find({ originTo: req.params.id })
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      artistPosts: result,
      totalCount: totalCount.length,
    },
  });
});

module.exports.toggleLikeArtistPost = catchAsync(async (req, res) => {
  const post = await ArtistPost.findById(req.params.id);
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

module.exports.replyArtistPost = catchAsync(async (req, res, next) => {
  try {
    await ArtistPost.findById(req.params.id);
  } catch (error) {
    return next(new AppError("This post doesn't exists", 400));
  }
  const newPost = new ArtistPostReply({
    author: req.user._id,
    originTo: req.params.id,
    replyTo: req.body.replyTo,
    text: req.body.text,
    published: Date.now(),
    liked: [],
    replyes: 0,
  });
  let replyTo;
  if (req.body.replyTo) {
    replyTo = await ArtistPostReply.findById(req.body.replyTo);
  } else {
    replyTo = await ArtistPost.findById(req.params.id);
  }
  replyTo.replyes += 1;
  await replyTo.save();
  await newPost.save();
  res.status(200).json({
    status: "success",
  });
});

module.exports.getArtistPostsReplyes = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const totalCount = await ArtistPostReply.find({
    originTo: req.params.id,
    replyTo: null,
  });
  const result = await ArtistPostReply.find({
    originTo: req.params.id,
    replyTo: null,
  })
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      artistPostsReplyes: result,
      totalCount: totalCount.length,
    },
  });
});
module.exports.getArtistPostsReplyesToReplyes = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const totalCount = await ArtistPostReply.find({ replyTo: req.params.id });
  const result = await ArtistPostReply.find({ replyTo: req.params.id })
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      artistPostsReplyes: result,
      totalCount: totalCount.length,
    },
  });
});
module.exports.toggleLikeArtistPostReply = catchAsync(async (req, res) => {
  const post = await ArtistPostReply.findById(req.params.id);
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
