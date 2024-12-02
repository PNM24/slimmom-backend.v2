// app.js
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const passport = require("./passport");
const connectToDb = require("./utils/connectToDb");
const authRouter = require("./routes/api/authRoutes");
const productsRouter = require("./routes/api/productRoutes");
const calorieInfoRoutes = require("./routes/api/calorieInfoRoutes");
const { swaggerUi, specs } = require("./swagger");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

connectToDb();

app.use(express.static("public"));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api", calorieInfoRoutes);

// Swagger endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
