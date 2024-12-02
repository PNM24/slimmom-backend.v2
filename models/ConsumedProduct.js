const mongoose = require("mongoose");

const consumedProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const ConsumedProduct = mongoose.model(
  "ConsumedProduct",
  consumedProductSchema
);

module.exports = ConsumedProduct;
