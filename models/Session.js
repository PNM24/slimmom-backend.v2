const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Tokenul de refresh expiră automat după 7 zile
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
