const mongoose = require("mongoose");
const fs = require("fs");
const Music = require("../models/musicModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("../utils/AppError");

module.exports.createMusic = catchAsync(async (req, res) => {
  const newMusic = new Music({
    authorId: req.user._id,
    title: req.body.title,
    published: Date.now(),
  });
  await newMusic.save();
  res.status(200).json({
    status: "success",
  });
});

module.exports.streamMusic = catchAsync(async (req, res, next) => {
  const range = req.headers.range;
    if (!range) {
      return next(new AppError("Requires Range header1", 400));
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
