const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");

const {
  createProduct,
  fetchProducts,
  getProductById,
  addToWishlist,
  removeWishlist,
  getWishlistProducts,
  toggleWishlist,
} = require("../controllers/productController.js");

const productRouter = express.Router();

productRouter.post("/create", authMiddleware, createProduct);
productRouter.get("/get-products", authMiddleware, fetchProducts);
productRouter.get("/get-product-detail/:id", authMiddleware, getProductById);

// productRouter.post("/add-wishlist", authMiddleware, addToWishlist);
// productRouter.post("/remove-wishlist", authMiddleware, removeWishlist);

productRouter.post("/toggle-wishlist", authMiddleware, toggleWishlist);
productRouter.get("/get-wishlist", authMiddleware, getWishlistProducts);

module.exports = productRouter;
