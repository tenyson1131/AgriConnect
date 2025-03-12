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
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
