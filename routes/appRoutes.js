const express = require("express");
const appController = require("../controllers/appController");

const appRouter = express.Router();
appRouter.route("/init").get(appController.initApp);
appRouter.route("/appInfo").get(appController.getAppInfo);
appRouter.route("/ticker").post(appController.updateTicker);

module.exports = appRouter;
