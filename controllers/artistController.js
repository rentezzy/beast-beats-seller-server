const mongoose = require("mongoose");
const Artist = require("../models/artistModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("./../utils/AppError");

module.exports.createArtist = catchAsync(async (req, res, next) => {
  const artist = new Artist({ user: req.user._id, about: req.body.about });
  artist.save();
  res.status(200).json({
    status: "success",
  });
});

module.exports.getArtist = catchAsync(async (req, res, next) => {
  let artist;
  try {
    artist = await Artist.findOne({ user: req.params.id });
  } catch {
    return next(new AppError("This artist doesn't exists yet", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      artist,
    },
  });
});
module.exports.getArtists = catchAsync(async (req, res) => {
  const artists = await Artist.find();
  res.status(200).json({
    status: "success",
    data: {
      artists,
    },
  });
});
