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
 * /api/products/search:
 *   get:
 *     summary: Caută produse
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
 *         description: Returnează lista produselor găsite.
 *       400:
 *         description: Query parameter 'title' is missing.
 */

