require("dotenv").config();
const mongoose = require("mongoose");

const DB_HOST = process.env.DB_HOST;

mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
