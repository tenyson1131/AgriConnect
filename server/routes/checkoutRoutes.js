const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  checkout,
  fetchOrders,
  getSellerOrders,
} = require("../controllers/checkoutController");

const checkoutRouter = express.Router();

checkoutRouter.post("/checkout", authMiddleware, checkout);
checkoutRouter.get("/get-orders", authMiddleware, fetchOrders);
checkoutRouter.get("/get-sellerOrders", authMiddleware, getSellerOrders);

module.exports = checkoutRouter;
