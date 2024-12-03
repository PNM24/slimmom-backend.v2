const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require('..//../services/emailServices');
const router = express.Router();
require("dotenv").config();

// Funcție pentru generare OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//! Endpoint pentru înregistrare
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp: {
        code: otp,
        expiry: otpExpiry,
        verified: false
      }
    });

    await newUser.save();

    // Trimitem atât email-ul de verificare cât și cel de bun venit
    const otpSent = await emailService.sendOTPEmail(email, otp);
    const welcomeSent = await emailService.sendWelcomeEmail(email, name);

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId: newUser._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Verificare OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp.expiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp.verified = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({
      message: "Email verified successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Retrimitere OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    user.otp = {
      code: otp,
      expiry: otpExpiry,
      verified: false
    };

    await user.save();

    const emailSent = await emailService.sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.json({ message: "New verification code sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Endpoint pentru autentificare
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.otp.verified) {
      // Trimitem un nou OTP dacă utilizatorul nu este verificat
      const otp = generateOTP();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      user.otp = {
        code: otp,
        expiry: otpExpiry,
        verified: false
      };

      await user.save();
      await emailService.sendOTPEmail(email, otp);

      return res.status(403).json({
        message: "Email not verified. A new verification code has been sent.",
        userId: user._id
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Endpoint pentru deconectare
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out successfully" });
});

//! Endpoint pentru crearea unui admin (Protejat, necesită rol de admin)
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      otp: {
        verified: true // Admin-ul nu necesită verificare email
      }
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Numele utilizatorului
 *         email:
 *           type: string
 *           format: email
 *           description: Email-ul utilizatorului
 *         password:
 *           type: string
 *           format: password
 *           description: Parola utilizatorului
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: Rolul utilizatorului
 *         calorieInfo:
 *           type: object
 *           properties:
 *             height:
 *               type: number
 *               description: Înălțimea în centimetri
 *             age:
 *               type: number
 *               description: Vârsta
 *             currentWeight:
 *               type: number
 *               description: Greutatea actuală
 *             desireWeight:
 *               type: number
 *               description: Greutatea dorită
 *             bloodType:
 *               type: number
 *               description: Grupa de sânge
 *             dailyRate:
 *               type: number
 *               description: Rata zilnică de calorii
 *             notRecommendedFoods:
 *               type: array
 *               items:
 *                 type: string
 *               description: Lista de alimente nerecomandate
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token-ul JWT pentru autentificare
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * tags:
 *   name: Auth
 *   description: API pentru autentificare și gestiunea utilizatorilor
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Înregistrare utilizator nou
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       201:
 *         description: Utilizator înregistrat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Date invalide sau utilizator existent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Eroare server
 * 
 * /api/auth/login:
 *   post:
 *     summary: Autentificare utilizator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "strongPassword123"
 *     responses:
 *       200:
 *         description: Autentificare reușită
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Credențiale invalide
 *       500:
 *         description: Eroare server
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Deconectare utilizator
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deconectare reușită
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: Neautorizat
 *       500:
 *         description: Eroare server
 */