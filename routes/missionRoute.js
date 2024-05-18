const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Mission = require("../models/missionModel");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/add-mission", authMiddleware, jsonParser, async (req, res) => {
  try {
    console.log(req.body, "req");
    const newMission = new Mission({
      ...req.body,
    });
    await newMission.save();
    res.status(201).json({ message: "Mission ajouté avec succès", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de mission", success: false });
  }
});

router.get("/get-mission", authMiddleware, jsonParser, async (req, res) => {
  try {
    const mission = await Mission.find({});
    res.status(200).json({ mission });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching missions", success: false });
  }
});

router.put("/update-mission/:id",authMiddleware,jsonParser,async (req, res) => {
    try {
      const updatedMission = await Mission.findByIdAndUpdate(
        req.params.id,
        req.body,
        { status: "valider" }, 
        { new: true }
      );

      const user = await User.findOne({ role:"logistique"});
      // Add a notification for the responsible logistique
      if (user) {
        user.unseenNotifications = user.unseenNotifications || [];
        user.unseenNotifications.push({
          type: "mission-validated",
          message: `This ${updatedMission.title} has been validated by ${updatedMission.agentLogistique}`,
          onClickPath: "/logistique/mission",
        });
        await user.save();
      }

      res.status(200).json({
        updatedMission,
        message: "Le mission a été mis à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Error updating mission: ", error);
      res
        .status(500)
        .json({ message: "Erreur de mise à jour du mission", success: false });
    }
  }
);

router.delete(
  "/delete-mission/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const deletedMission = await Mission.findByIdAndDelete(req.params.id);
      res.status(200).json({
        deletedMission,
        message: "La mission a été supprimé avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Error deleting mission: ", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du mission",
        success: false,
      });
    }
  }
);

router.get("/get-user", authMiddleware, jsonParser,async (req, res) => {
  try {
    const users = await User.find({ role: 'agentLogistique' }, 'firstName');
    console.log(users,'zzzzz');
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching agents", success: false });
  }
});

router.get("/missions", authMiddleware,jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    const missions = await Mission.find({ agentLogistique : user.firstName + " " + user.lastName });
    res.status(200).json(missions);
    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-mission",
      message: `You have new mission from the responsable`,
      onClickPath: "/agentLogistique",
    });
    user.unseenNotifications = unseenNotifications;
    await user.save();
    
  } catch (error) {
    console.error("Error fetching user missions:", error);
    console.log(error,'error');
    res.status(500).json({ message: "Error fetching user missions", success: false });
  }
});

module.exports = router;
