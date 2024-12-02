const mongoose = require("mongoose");

const connectToDb = async () => {

  try {
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDb;
