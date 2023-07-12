const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("./../controllers/authController");

const bookingRouter = express.Router();
bookingRouter.route("/create-session").post(bookingController.createSession);

module.exports = bookingRouter;
