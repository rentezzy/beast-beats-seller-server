const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    maxlenght: 16,
    minlenght: 3,
  },
  username: {
    type: String,
    require: [true, "Username is required"],
    unique: [true, "This username is already used"],
    maxlenght: 16,
    minlenght: 3,
  },
  avatar: {
    type: String,
    default: "default.jpg",
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: [true, "This Email is already used"],
    validate: [validator.isEmail, "Invalid e-mail"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    minlenght: 8,
    maxlength: 32,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Password confirm is required"],
    minlenght: 8,
    maxlength: 32,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "moderator", "artist", "publisher", "user"],
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre("/^find/", function (next) {
  this.select("-__v");
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async (userPass, dbPass) => {
  return await bcrypt.compare(userPass, dbPass);
};
userSchema.methods.isPasswordChanged = (timestamp) => {
  if (this.passwordChangedAt) {
    const changedAt = this.passwordChangedAt.getTime() / 1000;
    return timestamp < changedAt;
  }
  return false;
};
module.exports = new mongoose.model("User", userSchema);
