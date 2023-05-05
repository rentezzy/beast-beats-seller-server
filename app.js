const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const errorHandler = require("./controllers/errorController");

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/images", express.static("public"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
