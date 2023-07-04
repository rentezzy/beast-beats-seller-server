const express = require("express");
const musicCommentController = require("../controllers/musicCommentController");
const authController = require("./../controllers/authController");

const musicCommentsRouter = express.Router();
musicCommentsRouter
  .route("/musicComment/:id")
  .post(authController.protect, musicCommentController.createMusicComment);
musicCommentsRouter
  .route("/musicComments/:id")
  .get(musicCommentController.getMusicComments);
musicCommentsRouter
  .route("/like/:id")
  .post(authController.protect, musicCommentController.toggleLikeMusisComment);

module.exports = musicCommentsRouter;
