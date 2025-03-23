const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPost, fetchPost } = require("../controllers/postController");
const postRouter = express.Router();

postRouter.post("/create-post", authMiddleware, createPost);
postRouter.get("/get-post", authMiddleware, fetchPost);

module.exports = postRouter;
