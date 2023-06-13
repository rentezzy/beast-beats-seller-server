const express = require("express");
const newsPostController = require("../controllers/newsPostController");
const authController = require("./../controllers/authController");

const newsPostsRouter = express.Router();
newsPostsRouter
  .route("/newsPost")
  .post(
    authController.protect,
    authController.restrictTo("admin", "moderator", "publisher"),
    newsPostController.createNewsPost
  );
newsPostsRouter.route("/newsPosts").get(newsPostController.getNewsPosts);

module.exports = newsPostsRouter;
