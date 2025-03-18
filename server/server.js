require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require("./db/db.js");

// router imports
const authRouter = require("./routes/authRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");

// middelwares
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware.js");
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

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
