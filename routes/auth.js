const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");

router.post("/login", jsonParser, async (req, res) => {
  /*console.log(req.body);

  const { email, password } = req.body;
  User.findOne({ email: email }).then( (result) => {
    console.log(result);

    if (result) {
      if (result.password == password) {
        const token =  jwt.sign(
          { email: email, password: password },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res
          .status(200)
          .send({ msg: "Login Successfull", result, token: token });
      } else {
        res.status(500).send({ msg: "Enter Valid Password", result });
      }
    } else {
      res.status(500).send({ msg: "Enter Valid Email", result });
    }
  });*/
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.status(401).json({ msg: "User do not found" });
    
    //const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (req.body.password !== user.password) return res.status(401).json({ msg: "Invalid password" });

    // Create token
    const payload = {
      userId: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "token created successfully",
      token: token
  });
    // Return response with token
   /* res.cookie("accessToken", token, { httpOnly: true }).json({
      token,
      user: { id: user._id },
    });*/
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
