const mongoose = require("mongoose");

const musicCommentSchema = new mongoose.Schema({
  authorUsername: {
    type: String,
    maxlenght: 16,
    minlenght: 3,
  },
  originTo: {
    type: mongoose.ObjectId,
    require: [true, "Song id is required"],
  },
  timestamp: {
    type: Number,
  },
  text: {
    type: String,
    maxlenght: 300,
    minlenght: 10,
  },
  published: Date,
  liked: {
    type: [mongoose.ObjectId],
  },
});

module.exports = new mongoose.model("MusicComment", musicCommentSchema);
