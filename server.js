const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const fs = request("fs");
require("dotenv").config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DB.replace("<PASS>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("successful DB connection"))
  .catch((error) => console.log(error));

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  https
    .createServer(
      {
        key: fs.readFileSync("privkey.pem"),
        cert: fs.readFileSync("cert.pem"),
      },
      app
    )
    .listen(port, () => {
      console.log(`Started listening at port:${port}. Https true`);
    });
} else {
  app.listen(port, () => {
    console.log(`Started listening at port:${port}.`);
  });
}
