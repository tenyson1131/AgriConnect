const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getCommentByPost,
  addReply,
} = require("../controllers/commentController");

const commentRouter = express.Router();

commentRouter.post("/create-comment", authMiddleware, createComment);
commentRouter.post("/add-reply", authMiddleware, addReply);
commentRouter.get("/get-comment/:postId", authMiddleware, getCommentByPost);

module.exports = commentRouter;
