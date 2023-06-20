const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  ticker: {
    type: String,
    maxlenght: 64,
    minlenght: 20,
  },
  genres: {
    type: [String],
  },
  maxPrice: {
    type: Number,
  },
});

module.exports = new mongoose.model("App", appSchema);
