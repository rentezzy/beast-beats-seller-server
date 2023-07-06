const mongoose = require("mongoose");

let artistSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    unique: [true, "This artist already exists"],
  },
  about: {
    type: String,
    maxlenght: 1000,
    minlenght: 3,
  },
  avatar: {
    big: {
      type: String,
      default: "defaultBig.jpg",
    },
    poster: {
      type: String,
      default: "defaultPoster.jpg",
    },
  },
});

module.exports = new mongoose.model("Artist", artistSchema);
