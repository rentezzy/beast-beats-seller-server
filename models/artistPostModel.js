const mongoose = require("mongoose");

const artistPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
  },
  originTo: {
    type: mongoose.ObjectId,
    require: [true],
  },
  text: {
    type: String,
    maxlenght: 500,
    minlenght: 10,
  },
  published: Date,
  liked: {
    type: [mongoose.ObjectId],
  },
  replyes: Number,
});

module.exports = new mongoose.model("ArtistPost", artistPostSchema);
