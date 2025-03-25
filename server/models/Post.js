const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  img: { type: String, default: "" },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    img: { type: String, default: "" },
  },
  category: {
    type: String,
    enum: ["farmers", "buyers", "general"],
    default: "general",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  commentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
