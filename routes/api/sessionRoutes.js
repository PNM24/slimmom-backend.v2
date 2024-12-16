const express = require("express");
const jwt = require("jsonwebtoken");
const Session = require("../../models/Session");
const router = express.Router();
require("dotenv").config();

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });

    const session = await Session.findOne({ refreshToken });
    if (!session) return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
