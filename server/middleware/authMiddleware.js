const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authMiddleware = async (req, res, next) => {
  console.log("in auth middleware");

  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from 'Bearer token'

  if (!token) {
  console.log("in no token")
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
  console.log("in try token")

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    // req.user = decoded; // Attach user ID to request
    console.log("req user", req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
