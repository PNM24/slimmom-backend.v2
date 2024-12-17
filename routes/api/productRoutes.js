const express = require("express");
const Product = require("../../models/Product");
const ConsumedProduct = require("../../models/ConsumedProduct");
const { validateAuth } = require("../../middleware/authMiddleware");
const router = express.Router();

// Obține toate produsele
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Caută produse
router.get("/search", async (req, res) => {
  const { title } = req.query;

  try {
    const products = await Product.find({ title: { $regex: title, $options: "i" } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adaugă un produs consumat
router.post("/consumed", validateAuth, async (req, res) => {
  const { productId, date, quantity } = req.body;

  try {
    const consumedProduct = new ConsumedProduct({ userId: req.user._id, productId, date, quantity });
    await consumedProduct.save();

    res.status(201).json(consumedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Șterge un produs consumat
router.delete("/consumed/:id", validateAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ConsumedProduct.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Consumed product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obține lista tuturor produselor
 *     tags: [Produse]
 *     responses:
 *       200:
 *         description: Returnează lista de produse.
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Caută produse după titlu
 *     tags: [Produse]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: Titlul produsului căutat
 *     responses:
 *       200:
 *         description: Returnează produsele găsite.
 */

/**
 * @swagger
 * /api/products/consumed:
 *   post:
 *     summary: Adaugă un produs consumat
 *     tags: [Produse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               date:
 *                 type: string
 *                 example: "2024-06-12"
 *               quantity:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Consumed product added successfully.
 */

/**
 * @swagger
 * /api/products/consumed/{id}:
 *   delete:
 *     summary: Șterge un produs consumat
 *     tags: [Produse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID-ul produsului consumat
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consumed product deleted successfully.
 *       404:
 *         description: Product not found.
 */