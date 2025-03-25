const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../utils/email.js");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

async function signup(req, res) {
  try {
    const { email, password, name, role, farmName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = role === "farmer" ? "farmer" : "buyer";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // otp
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user = new User({
      uid: "",
      name,
      email,
      password: hashedPassword,
      role: userRole,
      farmName: userRole === "farmer" ? farmName : "",

      verified: false,
      otp,
      otpExpiry,
    });
    await user.save();

    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error while creating user",
      error: error,
    });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp != otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ message: "OTP verified successfully", token, user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP", error });
  }
}

async function login(req, res) {
  console.log("in login backend");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

module.exports = { signup, login, verifyOTP };
