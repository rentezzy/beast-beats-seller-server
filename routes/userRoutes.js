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
userRouter.route("/artists").get(userController.getArtists);
// userRouter
//   // .route("/:username") authController.protect,
//   // .get(userControllers.getUser)
//   // .patch(userControllers.updateUser)
//   // .delete(userControllers.deleteUser);

module.exports = userRouter;
