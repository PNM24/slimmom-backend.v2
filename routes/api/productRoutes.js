const express = require("express");
const Product = require("../../models/Product");
const ConsumedProduct = require("../../models/ConsumedProduct");
const DailyIntake = require("../../models/DailyIntake");
const calculateCalories = require("../../utils/calculateCalories");
const { validateAuth, authorizeRoles } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - weight
 *         - calories
 *         - categories
 *         - groupBloodNotAllowed
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of the product
 *         weight:
 *           type: number
 *           description: The weight of the product in grams
 *         calories:
 *           type: number
 *           description: The calories per 100g of product
 *         categories:
 *           type: string
 *           description: The category of the product
 *         groupBloodNotAllowed:
 *           type: array
 *           items:
 *             type: boolean
 *           description: Array indicating if product is not allowed for each blood type
 *     ConsumedProduct:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - date
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the consumed product
 *         userId:
 *           type: string
 *           description: The id of the user who consumed the product
 *         productId:
 *           type: string
 *           description: The id of the product consumed
 *         date:
 *           type: string
 *           format: date
 *           description: The date when the product was consumed
 *         quantity:
 *           type: number
 *           description: The quantity consumed in grams
 *     DailyIntakeInfo:
 *       type: object
 *       properties:
 *         dailyKcal:
 *           type: number
 *           description: Recommended daily calorie intake
 *         notRecommendedProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: List of products not recommended for user's blood type
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products and daily intake
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateAuth, authorizeRoles("admin"), async (req, res) => {
  const product = new Product({
    categories: req.body.categories,
    weight: req.body.weight,
    title: req.body.title,
    calories: req.body.calories,
    groupBloodNotAllowed: req.body.groupBloodNotAllowed,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/products/daily-intake:
 *   get:
 *     summary: Get daily intake recommendations
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: weight
 *         required: true
 *         schema:
 *           type: number
 *         description: User's weight in kg
 *       - in: query
 *         name: height
 *         required: true
 *         schema:
 *           type: number
 *         description: User's height in cm
 *       - in: query
 *         name: age
 *         required: true
 *         schema:
 *           type: number
 *         description: User's age in years
 *       - in: query
 *         name: bloodType
 *         required: true
 *         schema:
 *           type: number
 *         description: User's blood type (1-4)
 *     responses:
 *       200:
 *         description: Daily intake recommendations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyIntakeInfo'
 *       400:
 *         description: Invalid parameters
 */
router.get("/daily-intake", async (req, res) => {
  try {
    const { weight, height, age, bloodType } = req.query;

    const dailyKcal = calculateCalories(weight, height, age);
    if (dailyKcal === null) {
      return res
        .status(400)
        .json({ message: "Please provide valid weight, height, and age" });
    }

    const bloodTypeIndex = parseInt(bloodType, 10);
    const products = await Product.find({
      [`groupBloodNotAllowed.${bloodTypeIndex}`]: true,
    });

    res.json({
      dailyKcal,
      notRecommendedProducts: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/products/consumed:
 *   post:
 *     summary: Record consumed product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - date
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Consumed product recorded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsumedProduct'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.post("/consumed", validateAuth, async (req, res) => {
  try {
    const { productId, date, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const consumedProduct = new ConsumedProduct({
      userId,
      productId,
      date: new Date(date),
      quantity,
    });

    await consumedProduct.save();
    res.status(201).json(consumedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/products/day-info:
 *   get:
 *     summary: Get daily consumption information
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to get information for
 *     responses:
 *       200:
 *         description: Daily consumption info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                 totalCalories:
 *                   type: number
 *                 consumedProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConsumedProduct'
 *       400:
 *         description: Date is required
 *       401:
 *         description: Unauthorized
 */
router.get("/day-info", validateAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const consumedProducts = await ConsumedProduct.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("productId");

    let totalCalories = 0;
    consumedProducts.forEach((consumedProduct) => {
      const productCaloriesPerGram =
        consumedProduct.productId.calories / consumedProduct.productId.weight;
      totalCalories += productCaloriesPerGram * consumedProduct.quantity;
    });

    res.json({
      date: startDate,
      totalCalories,
      consumedProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       401:
 *         description: Unauthorized - Only admins can delete products
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", validateAuth, authorizeRoles("admin"), async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({ 
      message: "Product deleted successfully",
      deletedProduct: product 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;