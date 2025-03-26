require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require("./db/db.js");

const User = require("./models/User.js");

// router imports
const authRouter = require("./routes/authRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const postRouter = require("./routes/postRoute.js");
const userRouter = require("./routes/userRouter.js");
const commentRouter = require("./routes/commentRoutes.js");

// middelwares
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware.js");
const checkoutRouter = require("./routes/checkoutRoutes.js");

app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/comment", commentRouter);
app.use("/api/order", checkoutRouter);

// ------------fetch user ----------------
app.get("/api/get-user", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("error fetching user", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
});

app.get("/profile", authMiddleware, (req, res) => {
  console.log("in profile route");
  res.json({ xax: req.user });
});

async function startServer() {
  console.log("starting server....");
  try {
    await connectDB();
    app.listen(port, () => {
      console.log("server has started on port " + port);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
