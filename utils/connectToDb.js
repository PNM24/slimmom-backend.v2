const mongoose = require("mongoose");

/**
 * Conectează aplicația la baza de date MongoDB.
 * Citirea URI-ului bazei de date se face din variabilele de mediu.
 */
const connectToDb = async () => {
  const dbUri = process.env.DB_HOST || "mongodb://localhost:27017/slimmon_db";

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conexiune la baza de date realizată cu succes!");
  } catch (error) {
    console.error("❌ Eroare la conectarea bazei de date:", error.message);
    process.exit(1); // Închide aplicația în caz de eroare
  }
};

module.exports = connectToDb;
