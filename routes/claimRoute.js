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
    const { materielId, description } = req.body;
    const materiel = await Materiel.findOne(materielId);
    if (!materiel) {
      return res.status(404).json({ message: "Materiel not found", success: false });
    }
    console.log(materiel,'materiel');
    const newReclamation = new Claim({ materiel: materiel._id, description });
    console.log(newReclamation,'newReclamation');
    await newReclamation.save();
    res.status(201).json({ message: "Reclamation created successfully", success: true });
  } catch (error) {
    console.error("Error creating reclamation:", error);
    res
      .status(500)
      .json({ message: "Error creating reclamation", success: false });
  }
});



router.get("/get-all-claims", authMiddleware, async (req, res) => {
  try {
    const claims = await Claim.find({});
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ message: "Error fetching claims", success: false });
  }
});

router.get("/get-claims-by-materiel",authMiddleware,jsonParser,async (req, res) => {
  try {
    const materiel = await Materiel.findOne({ id: req.params.id });
    console.log(materiel,'materiel');
    if (!materiel) {
      return res.status(404).json({ message: "Materiel not found", success: false });
    }

    const claims = await Claim.find({ materiel: materiel._id}).populate('materiel');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ message: "Error fetching claims", success: false });
  }
});


router.put("/claims/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedClaim = await Claim.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json({ updatedClaim, message: "Claim updated successfully", success: true });
  } catch (error) {
    console.error("Error updating claim:", error);
    res.status(500).json({ message: "Error updating claim", success: false });
  }
});

router.put("/claims/:id/accept", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to mark the claim as accepted
    res.status(200).json({ message: "Claim accepted successfully", success: true });
  } catch (error) {
    console.error("Error accepting claim:", error);
    res.status(500).json({ message: "Error accepting claim", success: false });
  }
});

module.exports = router;
