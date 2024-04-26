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

    res.status(201).json({ message: "Matériel ajouté avec succès",success:true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du matériel",success:false });
  }
});

router.get("/get-materiel", authMiddleware, jsonParser, async (req, res) => {
    try {
        const materiel = await  Materiel.find({});
        res.status(200).json({materiel});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching materiels", success:false});
    }
});

router.put("/update-materiel/:id",authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({updatedMateriel , message:'Le materiel a été mis à jour avec succès',success:true});
  } catch (error) {
    console.error("Error updating materiel: ", error);
    res
      .status(500)
      .json({ message: "Erreur de mise à jour du matériel",success:false });
  }
});

router.delete("/delete-materiel/:id",authMiddleware, jsonParser, async (req, res) => {
  try {
    const deletedMateriel = await Materiel.findByIdAndDelete(
      req.params.id,
    );
    res.status(200).json({deletedMateriel, message:'Le matériel a été supprimé avec succès',success:true});
  } catch (error) {
    console.error("Error deleting materiel: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du matériel", success:false });
  }
});

module.exports = router;
