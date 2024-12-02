const mongoose = require("mongoose");

const dailyIntakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dailyKcal: {
    type: Number,
    required: true,
  },
  notRecommendedProducts: {
    type: [String], // Stocăm titlurile produselor nerecomandate
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const DailyIntake = mongoose.model("DailyIntake", dailyIntakeSchema);

module.exports = DailyIntake;
