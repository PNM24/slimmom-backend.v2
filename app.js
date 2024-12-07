const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const passport = require("./passport");
const connectToDb = require("./utils/connectToDb");
const authRouter = require("./routes/api/authRoutes");
const productsRouter = require("./routes/api/productRoutes");
const calorieInfoRoutes = require("./routes/api/calorieInfoRoutes");
const { swaggerUi, specs } = require("./swagger");
const emailService = require('./services/emailServices');

const app = express();

// Determinarea formatului pentru logger în funcție de mediu
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Conectare la baza de date
connectToDb();

// Middleware-uri globale
app.use(express.static("public")); // Servire fișiere statice din directorul public
app.use(logger(formatsLogger)); // Logger pentru cereri
app.use(cors())
app.use(express.json()); // Parsează cererile cu corp JSON

// Rute API
app.get("/", (req, res) => {
  res.json({ message: "API is running successfully!" });
});
app.use("/api/auth", authRouter); // Rute pentru autentificare
app.use("/api/products", productsRouter); // Rute pentru produse
app.use("/api", calorieInfoRoutes); // Alte rute

// Endpoint pentru documentația Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware pentru rută neexistentă (404)
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Middleware pentru tratarea erorilor
app.use((err, req, res, next) => {
  console.error("Error:", err.stack); // Log detaliat în consolă
  res.status(500).json({
    message: err.message || "Internal Server Error",
    stack: app.get("env") === "development" ? err.stack : undefined, // Stack doar în development
  });
});

// Verificare conexiune serviciu de email la pornirea aplicației
emailService.verifyConnection()
  .then(isReady => {
    if (isReady) {
      console.log('Email service is configured correctly');
    } else {
      console.error('Email service configuration failed. Emails will not be sent.');
    }
  })
  .catch(err => {
    console.error('Error during email service initialization:', err.message);
  });

module.exports = app;
