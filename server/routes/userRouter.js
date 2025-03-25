const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { changePfp } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/updatePfp", authMiddleware, changePfp);

module.exports = userRouter;
