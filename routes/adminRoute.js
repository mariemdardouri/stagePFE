const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const user = express();
const User = require("../models/userModel");
const Request = require("../models/requestModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");
const requestMiddleware = require("../middlewares/requestMiddleware");

user.use(jsonParser);

router.get("/request", authMiddleware, async (req, res) => {
  try {
    const request = await Request.find({ status: "pending" });
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching demande requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching demande requests", success: false });
  }
});

router.put("/accept-user/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log(req.params.id, "paramss");
    const request = await Request.findByIdAndDelete(
      requestId,
      { status: "active" },
      { new: true }
    );


    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found", success: false });
    }

    // Create a new user based on the request details
    const newUser = new User({
      firstName: request.firstName,
      lastName: request.lastName,
      cin: request.cin,
      email: request.email,
      phoneNumber: request.phoneNumber,
      password: request.password,
      role: request.role, 
      status: "active",
      seenNotifications: request.seenNotifications,
      unseenNotifications: request.unseenNotifications, // Set the user's status to active
    });

    const notification = {
      type: "user-account-activate",
      message: "Your account has been activated",
      onClickPath: "/notifications",
    };
    newUser.unseenNotifications.push(notification);

    await newUser.save();
    
    res
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).json({ message: "Error accepting user", success: false });
  }
});

router.get("/get-request", requestMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", success: false });
  }
});

router.get("/get-all-requests", jsonParser, async (req, res) => {
  try {
    const data = await Request.find({});
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Error fetching users", success: false });
  }
});

module.exports = router;
