const User = require("../models/User");

async function changePfp(req, res) {
  try {
    const { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.img = img;
    await user.save();

    return res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    console.log("error while changing pfp", error);
    return res
      .status(500)
      .json({ message: "Internal server error while changing pfp", error });
  }
}

module.exports = { changePfp };
