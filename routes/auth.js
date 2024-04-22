const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(jsonParser);

router.post("/login", jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ msg: "User do not found" });

    //const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (req.body.password !== user.password){
    return res
    .status(200)
    .send({ message: "Password is incorrect", success: false });
} else {
  const token = jwt.sign({ id: user._id,role: user.role},'PFE', {
    expiresIn: "1d",
  })
  res
    .status(200)
    .send({ message: "Login successful", success: true, token: token, role: user.role});
}
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post ('/register',jsonParser, async (req,res)=>{
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    console.log("body data",req.body);
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .json({ message: "User created successfully", success: true
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
  
});
router.post("/get-user-info", authMiddleware,jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id});
    console.log(req.body.id,'qqq');
    console.log(user,'www');
    if (!user) {
      return res.status(401).json({ msg: "User do not found" });
    }
    res.status(200).json({
      success: true,
      token: user,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Error getting user info", error: err.message });
  }
});

module.exports = router;
