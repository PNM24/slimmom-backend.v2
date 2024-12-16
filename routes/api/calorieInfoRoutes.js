const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { validateAuth } = require("../../middleware/authMiddleware");

router.post("/save-calorie-info", validateAuth, async (req, res) => {
  const { height, age, currentWeight, desireWeight, bloodType, dailyRate, notRecommendedFoods } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.calorieInfo = { height, age, currentWeight, desireWeight, bloodType, dailyRate, notRecommendedFoods };
    await user.save();

    res.status(200).json({ message: "Calorie information saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-calorie-info", validateAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.calorieInfo) return res.status(404).json({ message: "Calorie info not found" });

    res.status(200).json(user.calorieInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


/**
 * @swagger
 * /api/calorie-info/save-calorie-info:
 *   post:
 *     summary: Salvează informațiile calorice
 *     tags: [Calorii]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 example: 175
 *               age:
 *                 type: number
 *                 example: 25
 *               currentWeight:
 *                 type: number
 *                 example: 70
 *               desireWeight:
 *                 type: number
 *                 example: 65
 *               bloodType:
 *                 type: number
 *                 example: 1
 *               dailyRate:
 *                 type: number
 *                 example: 1500
 *               notRecommendedFoods:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Pizza", "Burger"]
 *     responses:
 *       200:
 *         description: Calorie information saved successfully.
 *       401:
 *         description: Unauthorized.
 */


