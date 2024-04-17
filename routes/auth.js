const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");
router.use(jsonParser);

router.post("/login", jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.status(401).json({ msg: "User do not found" });

    //const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (req.body.password !== user.password)
      return res.status(401).json({ msg: "Invalid password" });

    // Create token
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "login successfully",
      success: true,
      data: token,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});



module.exports = router;
