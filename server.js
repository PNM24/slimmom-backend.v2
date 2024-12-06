require("dotenv").config();
const express = require("express");
const app = express();
const colors = require("colors");

const PORT = process.env.PORT || 3000;

// Definește ruta de bază înainte de app.listen
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// Pornește serverul
app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`.green);
});