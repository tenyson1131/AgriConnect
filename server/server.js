require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const connectDB = require("./db/db.js");
const authRouter = require("./routes/authRoutes.js");

// middelwares
const cors = require("cors");
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRouter);

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
