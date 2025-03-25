const Comment = require("../models/Comment");
const Post = require("../models/Post");

async function createComment(req, res) {
  try {
    const { postId, content } = req.body;
    const userId = req.user._id;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "postId and content are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      postId,
      author: userId,
      content,
    });

    await newComment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return res.status(201).json({ message: "Comment created", newComment });
  } catch (error) {
    console.log("error commenting", error);
    return res.status(500).json({ message: "Error commenting", error });
  }
}

async function addReply(req, res) {
  try {
    const { commentId, content } = req.body;
    const userId = req.user._id;

    if (!commentId || !content) {
      return res
        .status(400)
        .json({ message: "commentId and content are required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      author: userId,
      content,
      likes: [],
    };

    comment.replies.push(newReply);
    await comment.save();

    return res.status(201).json({ message: "Comment reply added", comment });
  } catch (error) {
    console.log("error while adding comment reply", error);
    return res
      .status(500)
      .json({ message: "Error adding comment reply", error });
  }
}

async function getCommentByPost(req, res) {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "postId required" });
    }

    const comments = await Comment.find({ postId })
      .populate("author", "name img")
      .populate("replies.author", "name img")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    console.log("error fetching comment", error);
    return res.status(500).json({ message: "Error fetching comment", error });
  }
}

module.exports = { createComment, addReply, getCommentByPost };
