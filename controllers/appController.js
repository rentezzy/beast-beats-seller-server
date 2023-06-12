const mongoose = require("mongoose");
const App = require("../models/appModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("./../utils/AppError");

module.exports.initApp = catchAsync(async (req, res) => {
  const app = new App({ ticker: "Hi there from backend" });
  app.save();
  res.status(200);
});

module.exports.getTicker = catchAsync(async (req, res) => {
  const app = await App.findById(process.env.CURRENT_APP_ID);
  res.status(200).json({
    status: "success",
    data: {
      ticker: app.ticker,
    },
  });
});
module.exports.updateTicker = catchAsync(async (req, res, next) => {
  const text = req.body.ticker;
  if (!text) return next(new AppError("Field 'ticker' is required", 400));
  if (text.length < 20)
    return next(new AppError("Ticker length must be more than 20", 400));
  if (text.length > 100)
    return next(new AppError("Ticker length must be less than 64", 400));

  const app = await App.findById(process.env.CURRENT_APP_ID);
  app.ticker = text;
  await app.save();

  res.status(200).json({
    status: "success",
    data: {
      ticker: app.ticker,
    },
  });
});
