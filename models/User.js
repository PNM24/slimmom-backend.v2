const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
    verified: { type: Boolean, default: false },
  },
});

// Metodă pentru setarea parolei
userSchema.methods.setPassword = function (password) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(password, salt);
};

// Metodă pentru generarea OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Valabil 15 minute
    verified: false,
  };
  return otp;
};

// Metodă pentru verificarea OTP
userSchema.methods.verifyOTP = function (otp) {
  if (this.otp.expiresAt < new Date()) return false; // OTP expirat
  return this.otp.code === otp;
};

module.exports = mongoose.model("User", userSchema);
