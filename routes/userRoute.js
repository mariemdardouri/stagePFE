const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.use(jsonParser);
router.post("/get-user", jsonParser, authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
    });
    console.log("decoded user",req.user);
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, msg: "Failed to get user" });
  }
});
router.post("/get-user-info-by-role", authMiddleware,jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ role: req.body.role});
    if (!user) {
      return res.status(401).json({ msg: "User do not found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error getting user info", error: err.message });
  }
});

module.exports = router;
