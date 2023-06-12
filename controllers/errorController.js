const AppError = require("./../utils/AppError");

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};

const handleDuplicateErrorDB = (err) => {
  return new AppError(`Duplicate fields.`, 400);
};

const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  return new AppError(`${errors}`, 401);
};

const handleTokenExpireJWT = (err) => {
  return new AppError("This token has been expired", 401);
};

const handleTokenErrorJWT = (err) => {
  return new AppError("Token is not valid. Try login again.", 400);
};
const sendDevError = (err, res) => {
  return res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statuscode).json({
      status: err.status,
      message: err.errorMessage,
    });
  } else {
    console.error("ERROR", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 501;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.name === "MongoServerError" && err.code === 11000)
      error = handleDuplicateErrorDB(error);
    if (err.name === "ValidationError") error = handleValidateErrorDB(error);
    if (err.name === "TokenExpiredError") error = handleTokenExpireJWT(error);
    if (err.name === "JsonWebTokenError") error = handleTokenErrorJWT(error);
    sendProdError(error, res);
  }
};
