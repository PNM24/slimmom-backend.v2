const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categories: {
    type: String,
    required: true,
    trim: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  groupBloodNotAllowed: {
    type: [Boolean],
    required: true,
    default: [],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
