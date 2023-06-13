const mongoose = require("mongoose");

const newsPostSchema = new mongoose.Schema({
  authorUsername: {
    type: String,
    maxlenght: 16,
    minlenght: 3,
  },
  title: {
    type: String,
    maxlenght: 20,
    minlenght: 3,
  },
  text: {
    type: String,
    maxlenght: 300,
    minlenght: 30,
  },
  published: Date,
  liked: {
    type: [mongoose.ObjectId],
  },
});

module.exports = new mongoose.model("NewsPost", newsPostSchema);
