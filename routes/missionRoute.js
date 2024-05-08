const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Mission = require("../models/missionModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/add-mission", authMiddleware, jsonParser, async (req, res) => {
  try {
    console.log(req.body, "req");
    const newMission = new Mission({
      ...req.body,
    });
    await newMission.save();

    res
      .status(201)
      .json({ message: "Mission ajouté avec succès", success: true });
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

router.put(
  "/update-mission/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const updatedMission = await Mission.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

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

module.exports = router;
