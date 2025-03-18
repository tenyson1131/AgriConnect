const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const cartRouter = express.Router();

cartRouter.get("/get", authMiddleware, getCart);
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);

module.exports = cartRouter;
