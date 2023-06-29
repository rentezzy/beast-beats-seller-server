const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.ObjectId,
  },
  title: {
    type: String,
    require: true,
    maxlenght: 20,
    minlenght: 3,
  },
  genre: {
    type: String,
    require: true,
    maxlenght: 20,
    minlenght: 3,
  },
  price: {
    type: Number,
    require: true,
    maxlenght: 20,
    validate: {
      validator: function (el) {
        if (el < 0) return false;
      },
      message: "Price must be a postive number!",
    },
  },
  listenings: {
    type: Number,
  },
  image: {
    type: String,
    default: "default.png",
  },
  published: Date,
});

module.exports = new mongoose.model("Music", musicSchema);
