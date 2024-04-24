const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Materiel = require("../models/materielModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/add-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    console.log(req.body,'req');
    const newMateriel = new Materiel(req.body);
    await newMateriel.save();

    res.status(201).json({ message: "Materiel added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errot: "An error occurred while adding the materiel" });
  }
});

router.get("/get-materiel", authMiddleware, jsonParser, async (req, res) => {
    try {
        const materiel = await  Materiel.find({});
        console.log(materiel,"materiel");
        res.status(200).json({materiel});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ errot: "An error occurred while adding the materiel" });
    }
});

router.put("/update-materiel/:id",authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMateriel);
  } catch (error) {
    console.error("Error updating materiel: ", error);
    res
      .status(500)
      .json({ msg: "Error updating materiel", error: err.message });
  }
});

router.delete("/delete-materiel/:id",authMiddleware, jsonParser, async (req, res) => {
  try {
    const deletedMateriel = await Materiel.findByIdAndDelete(
      req.params.id,
    );
    res.status(200).json(deletedMateriel);
  } catch (error) {
    console.error("Error deleting materiel: ", error);
    res
      .status(500)
      .json({ msg: "Error deleting materiel", error: err.message });
  }
});

module.exports = router;
