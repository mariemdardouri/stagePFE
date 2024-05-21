const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const user = express();
const Claim = require("../models/claimModel");
const Materiel = require("../models/materielModel");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

user.use(jsonParser);
user.use(bodyParser.urlencoded({ extended: true }));

router.post("/add-reclamation", authMiddleware, jsonParser, async (req, res) => {
  try {
    const { userId,materielId,description } = req.body;  
    const materiel = await Materiel.findById(materielId);
    console.log(materielId,'id');
    if (!materiel) {
      return res.status(404).json({ message: "Matériel introuvable", success: false });
    }
    console.log(materiel,'materiel');
    const user = await User.findById(userId); 
    console.log(user,'userrrrrrrrrrr');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable", success: false });
    }
    
    const newReclamation = new Claim({ materiel: materiel._id, user: user._id, description });
    console.log(newReclamation,'newReclamation');
    await newReclamation.save();
    res.status(201).json({ message: "Réclamation créée avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la création de la réclamation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la réclamation", success: false });
  }
});



router.get("/get-all-claims",authMiddleware,jsonParser, async (req, res) => {
  try {
    const claims = await Claim.find({}).populate('materiel');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Erreur lors de la récupération des réclamations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", success: false });
  }
});

router.get("/get-claims-by-materiel/:id",authMiddleware,jsonParser,async (req, res) => {
  try {
   
    const user = req.params.id;
    console.log(user,'userId');
    if (!user) {
      return res.status(400).json({ message: "ID de l'utilisateur manquant", success: false });
    }

    const claims = await Claim.find({ user: user._id }).populate('materiel').populate('userId');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Erreur lors de la récupération des réclamations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", success: false });
  }
});


router.put("/claims/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedClaim = await Claim.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ updatedClaim, message: "Réclamation mise à jour avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réclamation:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réclamation", success: false });
  }
});

router.put("/claims/:id/accept", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to mark the claim as accepted
    res.status(200).json({ message: "Réclamation acceptée avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la réclamation:", error);
    res.status(500).json({ message: "Erreur lors de l'acceptation de la réclamation", success: false });
  }
});

module.exports = router;
