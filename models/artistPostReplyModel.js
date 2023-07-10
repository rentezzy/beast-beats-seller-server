const mongoose = require("mongoose");

const artistPostReplySchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
  },
  originTo: {
    type: mongoose.ObjectId,
    require: [true],
  },
  replyTo: { type: mongoose.ObjectId },
  replyes: Number,
  text: {
    type: String,
    maxlenght: 500,
    minlenght: 10,
  },
  published: Date,
  liked: {
    type: [mongoose.ObjectId],
  },
});

module.exports = new mongoose.model("ArtistPostReply", artistPostReplySchema);
