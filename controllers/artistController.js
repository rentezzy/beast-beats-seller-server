const mongoose = require("mongoose");
const Artist = require("../models/artistModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("./../utils/AppError");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");

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

exports.uploadArtistPhoto = upload.fields([
  { name: "big", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]);

exports.resizeArtistPhoto = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (!req.files) return next();

  await sharp(req.files.poster[0].buffer)
    .resize(1000, 300, { fit: "cover" })
    .toFormat("jpg")
    .toFile(`public/artists/poster/${req.artist._id}.jpg`);

  await sharp(req.files.big[0].buffer)
    .resize(512, 512)
    .toFormat("jpg")
    .toFile(`public/artists/big/${req.artist._id}.jpg`);

  next();
});

module.exports.createArtist = catchAsync(async (req, res, next) => {
  const artist = new Artist({ user: req.user._id, about: req.body.about });
  if (req.files) {
    artist.avatar = {
      big: artist._id + ".jpg",
      poster: artist._id + ".jpg",
    };
  }

  req.artist = artist;
  artist.save();
  next();
});
module.exports.createArtistFinish = catchAsync(async (req, res, next) => {
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
