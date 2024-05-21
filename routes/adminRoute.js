const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const user = express();
const User = require("../models/userModel");
const Request = require("../models/requestModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");

user.use(jsonParser);

router.get("/request", authMiddleware, async (req, res) => {
  try {
    
    const request = await Request.find({ status: "pending" });
    res.status(200).json(request);

  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de demande :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des demandes de demande", success: false });
  }
});

router.put("/accept-user/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log(req.params.id, "paramss");
    const request = await Request.findByIdAndDelete(
      requestId,
      { status: "activate" },
      { new: true }
    );


    if (!request) {
      return res
        .status(404)
        .json({ message: "Demande introuvable", success: false });
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
      status: "activate",
      seenNotifications: request.seenNotifications,
      unseenNotifications: request.unseenNotifications, // Set the user's status to active
    });

    const notification = {
      type: "user-account-activate",
      message: "Votre compte a été activé",
      onClickPath: "/notifications",
    };
    newUser.unseenNotifications.push(notification);

    await newUser.save();
    
    res
      .status(200)
      .json({ message: "Utilisateur créé avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de l'acceptation de l'utilisateur", success: false });
  }
});

router.get("/get-request", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", success: false });
  }
});

router.get("/get-all-requests", jsonParser, async (req, res) => {
  try {
    const data = await Request.find({});
    res.status(200).json({ data });

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs : ", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs ", success: false });
  }
});

module.exports = router;
