const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  otp: {
    code: String,
    expiry: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  calorieInfo: {
    height: Number,
    age: Number,
    currentWeight: Number,
    desireWeight: Number,
    bloodType: Number,
    dailyRate: Number,
    notRecommendedFoods: [String],
  },
});

// Hash password
userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validate password
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  this.otp = {
    code: otp.toString(),
    expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minute
    verified: false,
  };
  return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (code) {
  return this.otp.code === code && new Date() < this.otp.expiry;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
