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

    const user = await User.findById(req.body.agentLogistique);
    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-mission",
      message: `Vous avez une nouvelle mission du titre "${newMission.title}" de la part du résponsable logistique`,
      onClickPath: "/agentLogistique",
    });
    user.unseenNotifications = unseenNotifications;
    await user.save();
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
      .json({ message: "Erreur lors de la récupération des missions", success: false });
  }
});

router.put("/update-mission/:id",authMiddleware,jsonParser,async (req, res) => {
    try {
      const updatedMission = await Mission.findByIdAndUpdate(
        req.params.id,
        req.body, 
        { new: true }
      );

      res.status(200).json({
        updatedMission,
        message: "Mission a été mis à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la mission  ", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la mission ", success: false });
    }
  }
);

router.put('/valider-mission/:id', authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      {status: 'validate'},
      { new: true }
    );
    const agentLogistique = await User.findById(updatedMission.agentLogistique);
    const user = await User.findOne({ role:"logistique"});
      if (user) {
        user.unseenNotifications = user.unseenNotifications || [];
        user.unseenNotifications.push({
          type: "mission-validated",
          message: `Cette "${updatedMission.title}" a été validé par l'agent logistique "${agentLogistique.firstName +' '+agentLogistique.lastName}"`,
          onClickPath: "/logistique/mission",
        });
        await user.save();
      }
    res.status(200).json({
      updatedMission,
      message: "Les missions ont été validé avec succès",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la validation de la mission: ", error);
    res.status(500).json({
      message: "Erreur lors de la validation de la mission",
      success: false
    });
  }
});
router.put('/reject-mission/:id', authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      {status: 'rejected'},
      { new: true }
    );

    const user = await User.findOne({ role:"logistique"});
    if (user) {
      user.unseenNotifications = user.unseenNotifications || [];
      user.unseenNotifications.push({
        type: "mission-validated",
        message: `Cette "${updatedMission.title}" a été rejeté par l'agent logistique ${updatedMission.agentLogistique}`,
        onClickPath: "/logistique/mission",
      });
      await user.save();
    }

    res.status(200).json({
      updatedMission,
      message: "Les missions ont été rejetés avec succès",
      success: true
    });
  } catch (error) {
    console.error("Erreur lors du rejet des missions: ", error);
    res.status(500).json({
      message: "Erreur lors du rejet des missions",
      success: false
    });
  }
});
router.delete("/delete-mission/:id",authMiddleware,jsonParser,async (req, res) => {
    try {
      const deletedMission = await Mission.findByIdAndDelete(req.params.id);
      res.status(200).json({
        deletedMission,
        message: "La mission a été supprimé avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du mission: ", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du mission",
        success: false,
      });
    }
  }
);

router.get("/get-user", authMiddleware, jsonParser,async (req, res) => {
  try {
    const users = await User.find({ role: 'agentLogistique' }, 'firstName lastName');
    console.log(users,'zzzzz');
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des agents", success: false });
  }
});

router.get("/missions", authMiddleware,jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    const missions = await Mission.find({ agentLogistique : user._id });
    res.status(200).json(missions);
   
    
  } catch (error) {
    console.error("Erreur lors de la récupération des missions utilisateur:", error);
    console.log(error,'error');
    res.status(500).json({ message: "Erreur lors de la récupération des missions utilisateur", success: false });
  }
});

module.exports = router;
