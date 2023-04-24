const express = require("express");
const mongoose = require("mongoose");
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

app.listen(port, () => {
  console.log(`Started listening at port:${port}`);
});
