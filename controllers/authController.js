const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const { catchAsync } = require("./../utils/catchError");

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createSendJWT = catchAsync(async (res, user, code) => {
  const token = signJWT(user._id);
  const cookie = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRESIN_NUM * 5_184_000_000
    ),
    httpOnly: true,
    origin: "http://localhost:3000",
  };
  // if (process.env.NODE_ENV === "production") cookie.secure = true;

  res.cookie("jwt", token, cookie);

  res.status(code).json({
    status: "success",
    data: {
      user: {
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        role: user.role,
        username: user.username,
        _id: user._id,
      },
    },
  });
});

module.exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    avatar: req.body.avatar,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  await newUser.save();
  newUser.password = undefined;
  newUser.active = undefined;
  newUser.__v = undefined;

  createSendJWT(res, newUser, 201);
});

module.exports.logIn = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Username and password required", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 400));
  }

  createSendJWT(res, user, 201);
});

module.exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You must be logged in to access this", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("This user no longer exist", 400));
  }

  if (user.isPasswordChanged(decoded.iat)) {
    return next(
      new AppError("Password was changed recently. Please login again!", 400)
    );
  }

  req.user = user;
  res.locals.user = user;
  next();
});
