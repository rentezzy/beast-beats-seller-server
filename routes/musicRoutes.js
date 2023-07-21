const express = require("express");
const musicController = require("../controllers/musicController");
const authController = require("./../controllers/authController");

const musicRouter = express.Router();
musicRouter.route("/music").post(
  authController.protect,
  authController.restrictTo("artist"),
  musicController.uploadCover,
  musicController.createMusic,
  musicController.resizeCover,
  musicController.finishCreateMusic
);
musicRouter.route("/audio/:musicId").post(
  authController.protect,
  authController.restrictTo("artist"),
  musicController.addAudioMusic,
  musicController.uploadAudio,
  musicController.finishCreateMusic
);
musicRouter.route("/music/:id").get(musicController.streamMusic);
musicRouter.route("/musicInfo/:id").get(musicController.getMusic);
musicRouter.route("/musics").get(musicController.filteredMusic);

module.exports = musicRouter;
