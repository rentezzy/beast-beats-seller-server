const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.ObjectId,
  },
  title: {
    type: String,
    maxlenght: 20,
    minlenght: 3,
  },
  published: Date,
});

module.exports = new mongoose.model("Music", musicSchema);
