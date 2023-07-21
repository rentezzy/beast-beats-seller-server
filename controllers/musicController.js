const mongoose = require("mongoose");
const fs = require("fs");
const Music = require("../models/musicModel");
const App = require("../models/appModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("../utils/AppError");

const multer = require("multer");
const sharp = require("sharp");

const multerStorageImage = multer.memoryStorage();
const multerStorageAudio = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "music");
  },
  filename: function (req, file, cb) {
    cb(null, req.music._id + ".mp3");
  },
});

const multerFilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const multerFilterAudio = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an audio Please upload only audio.", 400), false);
  }
};

const uploadImage = multer({
  storage: multerStorageImage,
  fileFilter: multerFilterImage,
});
const uploadAudio = multer({
  storage: multerStorageAudio,
  fileFilter: multerFilterAudio,
});

exports.uploadCover = uploadImage.single("cover");
exports.uploadAudio = uploadAudio.single("audio");
exports.resizeCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  await sharp(req.file.buffer)
    .resize(256, 256)
    .toFormat("png")
    .toFile(`public/mus/${req.music._id}.png`);

  next();
});

module.exports.createMusic = catchAsync(async (req, res, next) => {
  const app = await App.findById(process.env.CURRENT_APP_ID);
  if (req.body.price > app.maxPrice) {
    app.maxPrice = req.body.price;
    await app.save();
  }
  if (!app.genres.includes(req.body.genre)) {
    app.genres.push(req.body.genre);
    await app.save();
  }
  const newMusic = new Music({
    authorId: req.user._id,
    title: req.body.title,
    genre: req.body.genre,
    price: +req.body.price,
    listenings: 0,
    published: Date.now(),
  });
  req.music = newMusic;
  newMusic.image = newMusic._id + ".png";
  await newMusic.save();
  next();
});
module.exports.finishCreateMusic = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      music: req.music,
    },
  });
});

module.exports.addAudioMusic = catchAsync(async (req, res, next) => {
  const music = await Music.findById(req.params.musicId);

  if (!music) {
    return next(new AppError("No such song.", 400));
  }

  if (music.authorId.toString() !== req.user._id.toString()) {
    return next(new AppError("Is not your song.", 400));
  }

  req.music = music;

  return next();
});

module.exports.getMusic = catchAsync(async (req, res) => {
  const music = await Music.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      music,
    },
  });
});

module.exports.filteredMusic = catchAsync(async (req, res) => {
  const filters = {};
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const skip = (page - 1) * limit;

  if (req.query.genre !== "all") filters.genre = req.query.genre;
  if (req.query.author !== "all") filters.authorId = req.query.author;
  filters.price = {
    $gte: `${req.query.priceFrom}`,
    $lte: `${req.query.priceTo}`,
  };

  const totalCount = await Music.find(filters);
  const musics = await Music.find(filters)
    .sort({ published: "descending" })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: {
      musics,
      totalCount: totalCount.length,
    },
  });
});

module.exports.streamMusic = catchAsync(async (req, res, next) => {
  const range = req.headers.range;
  if (!range) {
    return next(new AppError("Requires Range header", 400));
  }

  const audioPath = `${__dirname}/../music/${req.params.id}.mp3`;
  const audioSize = fs.statSync(audioPath).size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${audioSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mp3",
  };

  res.writeHead(206, headers);

  const audioStream = fs.createReadStream(audioPath, { start, end });

  audioStream.pipe(res);
});
