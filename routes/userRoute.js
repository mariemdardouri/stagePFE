const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.use(jsonParser);

router.get("/get-all-users",authMiddleware, jsonParser, async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json({
      
      data
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res
      .status(500)
      .json({ msg: "error fetching users", error: err.message });
  }
});
module.exports = router;
