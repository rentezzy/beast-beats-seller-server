const express = require("express");
const artistPostController = require("../controllers/artistPostController");
const authController = require("./../controllers/authController");

const artistPostRouter = express.Router();
artistPostRouter
  .route("/")
  .post(authController.protect, artistPostController.createArtistPost);
artistPostRouter.route("/:id").get(artistPostController.getArtistPosts); // artist id
artistPostRouter
  .route("/reply/:id") // post id
  .post(authController.protect, artistPostController.replyArtistPost)
  .get(artistPostController.getArtistPostsReplyes);
artistPostRouter
  .route("/reply/reply/:id") // reply id
  .get(artistPostController.getArtistPostsReplyesToReplyes);
artistPostRouter
  .route("/like/:id") // post id
  .post(authController.protect, artistPostController.toggleLikeArtistPost);
artistPostRouter
  .route("/reply/like/:id") // post id
  .post(authController.protect, artistPostController.toggleLikeArtistPostReply);

module.exports = artistPostRouter;
