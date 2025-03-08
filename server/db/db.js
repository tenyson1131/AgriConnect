const mongoose = require("mongoose");

async function connectDB() {
  //   console.log("mongo uri: ", process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
