require("dotenv").config();
const jwt = require("jsonwebtoken");

const payload = { userId: "12345", role: "user" };

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
console.log("Generated Token:", token);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded Token:", decoded);
} catch (err) {
  console.error("Error verifying token:", err.message);
}
