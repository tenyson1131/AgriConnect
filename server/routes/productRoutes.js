const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");

const {
  createProduct,
  fetchProduct,
} = require("../controllers/productController.js");

const productRouter = express.Router();

productRouter.post("/create", authMiddleware, createProduct);
productRouter.get("/get-products", authMiddleware, fetchProduct);

module.exports = productRouter;
