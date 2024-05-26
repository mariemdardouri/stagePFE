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

router.post("/add-request", authMiddleware, jsonParser, async (req, res) => {
  try {
    const { firstName, lastName, cin, email, phoneNumber, role } = req.body;

    const hashedPassword = await bcrypt.hash(cin, 10); 
    const newRequest = new Request({
      firstName: firstName,
      lastName: lastName,
      cin: cin,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword, 
      role: role,
      status: "pending",
    });
    await newRequest.save();
    const user = await User.findOne({ role: 'admin' });
    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-user",
      message: 'Vous avez reçu une nouvelle demande d\'utilisateur',
      onClickPath: "/admin/demande",
    });
    user.unseenNotifications = unseenNotifications;
    await user.save();
    res.status(201).json({ message: "Demande ajouté avec succès", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du demande", success: false });
  }
});
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

router.put("/update-request/:id",authMiddleware,jsonParser,async (req, res) => {
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json({
      updatedRequest,
      message: "La demande a été mis à jour avec succès",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du demande: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du demande", success: false });
  }
}
);

router.delete( "/delete-request/:id", authMiddleware, jsonParser,async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);
    res.status(200).json({deletedRequest,message: "La demande a été supprimé avec succès",success: true,});
  } catch (error) {
    console.error("Erreur lors de la suppression du demande: ", error);
    res.status(500).json({message: "Erreur lors de la suppression du demande",success: false});
  }
}
);
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
      unseenNotifications: request.unseenNotifications, 
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
