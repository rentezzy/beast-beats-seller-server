module.exports = class AppError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.errorMessage = message;
    this.statuscode = statuscode;
    this.status = statuscode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
};
