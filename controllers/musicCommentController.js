const mongoose = require("mongoose");
const MusicComment = require("../models/musicCommentModel");
const { catchAsync } = require("../utils/catchError");

module.exports.createMusicComment = catchAsync(async (req, res) => {
  const comment = new MusicComment({
    authorUsername: req.user.username,
    originTo: req.params.id,
    text: req.body.text,
    timestamp: req.body.timeStamp || 0,
    published: Date.now(),
    liked: [],
  });
  await comment.save();
  res.status(200).json({
    status: "success",
  });
});

module.exports.getMusicComments = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const totalCount = await MusicComment.find({ originTo: req.params.id });
  const result = await MusicComment.find({ originTo: req.params.id })
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      musicComments: result,
      totalCount: totalCount.length,
    },
  });
});

module.exports.toggleLikeMusisComment = catchAsync(async (req, res) => {
  const post = await MusicComment.findById(req.params.id);
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
