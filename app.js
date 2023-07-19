const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const appRoutes = require("./routes/appRoutes");
const newsPostsRoutes = require("./routes/newsPostsRoutes");
const musicRoutes = require("./routes/musicRoutes");
const musicCommentRoutes = require("./routes/musicCommentRoutes");
const artistRoutes = require("./routes/artistRoutes");
const artistPostRoutes = require("./routes/artistPostRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const AppError = require("./utils/AppError");
const errorHandler = require("./controllers/errorController");

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN_USER,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/app", appRoutes);
app.use("/api/v1/news", newsPostsRoutes);
app.use("/api/v1/music", musicRoutes);
app.use("/api/v1/musicComment", musicCommentRoutes);
app.use("/api/v1/artist", artistRoutes);
app.use("/api/v1/artistPost", artistPostRoutes);
app.use("/api/v1/booking", bookingRoutes);

app.use("/api/v1/images", express.static("public"));
app.use("/api/v1/audio", express.static("music"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
