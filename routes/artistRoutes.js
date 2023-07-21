const express = require("express");
const artistController = require("../controllers/artistController");
const authController = require("./../controllers/authController");

const artistRouter = express.Router();
artistRouter
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("artist"),
    artistController.uploadArtistPhoto,
    artistController.createArtist,
    artistController.resizeArtistPhoto,
    artistController.createArtistFinish
  );
artistRouter.route("/:id").get(artistController.getArtist);
artistRouter.route("/").get(artistController.getArtists);

module.exports = artistRouter;
