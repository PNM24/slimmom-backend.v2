const app = require("./app"); // Importă aplicația Express din app.js
const dotenv = require("dotenv");

dotenv.config();

// Portul pe care rulează serverul
const PORT = process.env.PORT || 3000;

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
});
