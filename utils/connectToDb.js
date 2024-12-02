const mongoose = require("mongoose");

const connectToDb = async () => {
  console.log("DB_HOST:", process.env.DB_HOST); // Depanare: verifică dacă DB_HOST este definit

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
