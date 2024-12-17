const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Session = require("../../models/Session");
const emailService = require("../../services/emailServices");
const router = express.Router();
require("dotenv").config();

// Funcție pentru generarea Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Funcție pentru generarea Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

// Endpoint: Înregistrare utilizator
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email });
    newUser.setPassword(password);

    const otp = newUser.generateOTP();
    await newUser.save();

    await emailService.sendOTPEmail(email, otp);
    res.status(201).json({ message: "User registered. Verify OTP sent to email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint: Verificare OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp.verified = true;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await new Session({ userId: user._id, refreshToken }).save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint: Login utilizator
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await new Session({ userId: user._id, refreshToken }).save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Endpoint: Logout utilizator
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    await Session.deleteOne({ refreshToken });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Înregistrare utilizator nou
 *     tags: [Autentificare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: User already exists.
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verificare OTP
 *     tags: [Autentificare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentificare utilizator
 *     tags: [Autentificare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Deconectare utilizator
 *     description: Logout utilizator și invalidare refresh token.
 *     tags: [Autentificare]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your-refresh-token"
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       500:
 *         description: Server error.
 */