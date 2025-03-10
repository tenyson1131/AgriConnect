const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["buyer", "farmer"],
      default: "buyer",
    },
    farmName: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
