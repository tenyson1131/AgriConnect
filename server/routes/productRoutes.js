const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");

const {
  createProduct,
  fetchProducts,
  getProductById,
} = require("../controllers/productController.js");

const productRouter = express.Router();

productRouter.post("/create", authMiddleware, createProduct);
productRouter.get("/get-products", authMiddleware, fetchProducts);
productRouter.get("/get-product-detail/:id", authMiddleware, getProductById);

module.exports = productRouter;
