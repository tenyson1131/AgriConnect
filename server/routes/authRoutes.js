const express = require("express");
const {
  signup,
  login,
  verifyOTP,
} = require("../controllers/authController.js");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/login", login);

module.exports = authRouter;
