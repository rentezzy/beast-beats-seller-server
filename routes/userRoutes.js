const express = require("express");
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

const userRouter = express.Router();
userRouter.route("/").get(userController.getAllUsers);
userRouter.route("/signup").post(authController.signUp);
userRouter.route("/login").post(authController.logIn);
userRouter
  .route("/login")
  .delete(authController.protect, userController.logOut);
userRouter.route("/me").get(authController.protect, userController.getMe);
userRouter.patch(
  "/me",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateUser
);

userRouter.patch(
  "/password",
  authController.protect,
  authController.updatePassword
);

userRouter.route("/artists").get(userController.getArtists);
userRouter.route("/user/:id").get(userController.getUser);
userRouter
  .route("/cart/:id")
  .get(authController.protect, userController.toggleCart);

module.exports = userRouter;
