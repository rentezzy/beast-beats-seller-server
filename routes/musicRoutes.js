const express = require("express");
const musicController = require("../controllers/musicController");
const authController = require("./../controllers/authController");

const musicRouter = express.Router();
musicRouter
  .route("/music")
  .post(authController.protect, musicController.createMusic);
musicRouter
  .route("/music/:id")
  .get(musicController.streamMusic);

module.exports = musicRouter;
