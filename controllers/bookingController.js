const mongoose = require("mongoose");
const crypto = require("crypto");

const Music = require("../models/musicModel");
const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchError");
const AppError = require("./../utils/AppError");

module.exports.createSession = catchAsync(async (req, res, next) => {
  const cart = req.body.cart;
  if (cart.length > 10) {
    return next(new AppError("Only 10 items per 1 purshache", 400));
  }

  const items = cart.map(async (songId) => {
    const song = await Music.findById(songId);
    return {
      amount: 1,
      price: song.price,
      cost: song.price,
      id: song._id,
    };
  });

  const totalPrice = items.reduce((summary, item) => (summary += item.cost), 0);

  const orderId = req.body.cart.join("/");

  //   TODO: Add urls after deploy

  const object = {
    version: 3,
    public_key: process.env.PAYMENT_PUBLIC,
    action: "pay",
    amount: totalPrice,
    currency: "USD",
    description: "For beats",
    order_id: orderId,
    customer: req.user,
    rro_info: {
      items,
    },
    product_description: "BEATS",
    product_name: "BEAT",
    server_url: ``,
    result_url: ``,
  };
  const json = JSON.stringify(object);
  const data = Buffer.from(json).toString("base64");
  const sign_string = `${process.env.PAYMENT_PRIVATE}${data}${process.env.PAYMENT_PRIVATE}`;
  const signature = crypto
    .createHash("sha1")
    .update(sign_string)
    .digest("base64");

  res.status(200).json({
    signature,
    data,
  });
});

module.exports.sessionCharged = catchAsync(async (req, res, next) => {
  const data = req.body.data;
  const sign_string = `${process.env.PAYMENT_PRIVATE}${data}${process.env.PAYMENT_PRIVATE}`;
  const signature = crypto
    .createHash("sha1")
    .update(sign_string)
    .digest("base64");

  if (signature !== req.body.signature) {
    return next(new AppError("Wrong payment", 400));
  }
  const originData = new Buffer.from(data, "base64").toString("ascii");
  // TODO: Remove from user cart and music list after succsses payment.
  const cart = originData.order_id.split("/");
  const user = await User.findById(originData.customer);

  res.status(200).json({
    status: "succses",
  });
});
