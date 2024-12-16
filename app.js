const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");
const connectToDb = require("./utils/connectToDb");

// Configurarea variabilelor de mediu
dotenv.config();

// Inițializarea aplicației Express
const app = express();

// Middleware-uri globale
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Conectarea la baza de date MongoDB
connectToDb();

// Configurarea Passport pentru JWT
require("./passport");
app.use(passport.initialize());

// Documentația Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importarea rutelor
const authRoutes = require("./routes/api/authRoutes");
const calorieInfoRoutes = require("./routes/api/calorieInfoRoutes");
const productRoutes = require("./routes/api/productRoutes");
const sessionRoutes = require("./routes/api/sessionRoutes");

// Rutele API
app.use("/api/auth", authRoutes);
app.use("/api/calorie-info", calorieInfoRoutes);
app.use("/api/products", productRoutes);
app.use("/api/session", sessionRoutes);

// Răspuns pentru ruta principală
app.get("/", (req, res) => {
  res.send("✅ SlimMom Backend API is running...");
});

// Gestionarea rutelor inexistente
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// Exportă aplicația Express pentru a fi utilizată în `server.js`
module.exports = app;
