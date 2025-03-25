const Post = require("../models/Post");

async function createPost(req, res) {
  try {
    const { title, content, category, img } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const newPost = new Post({
      title,
      content,
      img,
      author: {
        id: userId,
        name: req.user.name,
        img: req.user.img || "",
      },
      category: category || "general",
    });

    await newPost.save();
    return res.status(201).json({ message: "Post created", newPost });
  } catch (error) {
    console.log("error creating post", error);
    return res.status(500).json({ message: "Error creating post", error });
  }
}

async function fetchPost(req, res) {
  try {
    const posts = await Post.find();
    return res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching post", error);
    return res.status(500).json({ message: "Error fetching post", error });
  }
}

module.exports = { createPost, fetchPost };
