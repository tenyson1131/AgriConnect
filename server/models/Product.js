const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  category: {
    type: String,
    enum: [
      "Fruits",
      "Vegetables",
      "Herbs and Spices",
      "Grains and Pulses",
      "Nuts and Dry Fruits",
      "Dairy and Animal Products",
      "Organic and Specialty Products",
      "Handmade Pickles",
      "Farming Inputs and Supplies",
      "Handmade Snacks",
    ],
    required: true,
  },
  stock: { type: Number, required: true },
  unit: {
    type: String,
    enum: [
      "Kilogram (kg)",
      "Gram (g)",
      "Liter (L)",
      "Milliliter (ml)",
      "Piece (pc)",
      "Dozen",
      "Box",
      "Bag",
      "Bundle",
      "Meter (m)",
    ],
    default: "Kilogram (kg)",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  farmName: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
