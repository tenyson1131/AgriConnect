const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    img: { type: String, default: "" },
    role: {
      type: String,
      enum: ["buyer", "farmer"],
      default: "buyer",
    },
    farmName: { type: String, default: "" },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    // otp verification stuff
    verified: { type: Boolean, default: false },
    otp: { type: Number, required: false },
    otpExpiry: { type: Date, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
