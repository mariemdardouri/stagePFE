const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Materiel = require("../models/materielModel");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/add-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    console.log(req.body, "req");
    const newMateriel = new Materiel({
      ...req.body,
      numInv:''
    });
    await newMateriel.save();
    const user = await User.findOne({ role: 'deploiement' });
    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-list-matetiel",
      message: `You have new list materiel`,
      onClickPath: "/deploiement",
    });
    user.unseenNotifications = unseenNotifications;
    await user.save();
    res
      .status(201)
      .json({ message: "Matériel ajouté avec succès", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du matériel", success: false });
  }
});

router.get("/get-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    const materiel = await Materiel.find({});
    res.status(200).json({ materiel });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching materiels", success: false });
  }
});

router.put("/update-materiel/:id",authMiddleware,jsonParser,async (req, res) => {
    try {
      const updatedMateriel = await Materiel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      const user = await User.findOne({ role:'logistique' });
      console.log(user,'ooooo');
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "numInv-added",
          message: `The responsable approvisionnement added numInv to the materiel`,
          onClickPath: "/logistique",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }
      res.status(200).json({
        updatedMateriel,
        message: "Le materiel a été mis à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Error updating materiel: ", error);
      res
        .status(500)
        .json({ message: "Erreur de mise à jour du matériel", success: false });
    }
  }
);
router.put('/accept-materiels', authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMateriels = await Materiel.updateMany(
      { _id: { $in: req.body.map(materiel => materiel._id) } },
      { $set: { status: 'accepted' } },
      { multi: true }
    );
    const user = await User.findOne({ role:'approvisionnement' });
    console.log(user,'ooooo');
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "accepted-list-materiel",
        message: `The list of materiels has been accepted`,
        onClickPath: "/approvisionnement",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }
    res.status(200).json({
      updatedMateriels,
      message: "Les matériels ont été mis à jour avec succès",
      success: true
    });
  } catch (error) {
    console.error("Error updating materiels: ", error);
    res.status(500).json({
      message: "Erreur de mise à jour des matériels",
      success: false
    });
  }
});
router.put('/reject-materiels', authMiddleware, jsonParser, async (req, res) => {
  try {
    const materielsIds = req.body;
    const updatedMateriels = await Materiel.updateMany(
      { _id: { $in: materielsIds } },
      { $set: { status: 'rejected' } },
      { multi: true }
    );
    const user = await User.findOne({ role:'approvisionnement' });
    console.log(user,'ooooo');
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "rejected-list-materiel",
        message: `The list of materiels has been rejected`,
        onClickPath: "/approvisionnement",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }

    res.status(200).json({
      updatedMateriels,
      message: "Les matériels non vérifiés ont été rejetés avec succès",
      success: true
    });
  } catch (error) {
    console.error("Error rejecting materiels: ", error);
    res.status(500).json({
      message: "Erreur lors de la réjection des matériels",
      success: false
    });
  }
});

router.delete( "/delete-materiel/:id", authMiddleware, jsonParser,async (req, res) => {
    try {
      const deletedMateriel = await Materiel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        deletedMateriel,
        message: "Le matériel a été supprimé avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Error deleting materiel: ", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du matériel",
        success: false,
      });
    }
  }
);
router.put('/affecter-materiels', authMiddleware, jsonParser, async (req, res) => {
  try {
    const materielsToUpdate = req.body.materiels;

    console.log(materielsToUpdate,'materielsToUpdate');

    if (!Array.isArray(materielsToUpdate)) {
      throw new Error('materielsToUpdate is not an array');
    }

    for (const materiel of materielsToUpdate) {
      console.log(materiel,'materiel');
      await Materiel.findByIdAndUpdate(materiel._id, { agent: materiel.agent });
      
      const user = await User.findOne({ _id: materiel.agent });
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "materiel-assigned",
          message: `Un nouveau matériel vous a été affecté : ${materiel.nature}`,
          onClickPath: "/agent"
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }
    }

    res.status(200).json({
      message: "Matériels affectés avec succès",
      success: true
    });
  } catch (error) {
    console.log(error,'error');
    console.error("Error affecting materiels: ", error);
    res.status(500).json({
      message: "Erreur lors de l'affectation des matériels",
      success: false
    });
  }
});

router.get("/get-materiels-affected-to-agent",authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    
    const affectedMateriels = await Materiel.find({ agent: user._id });

    res.status(200).json(affectedMateriels);
  } catch (error) {
    console.error("Error fetching affected materiels: ", error);
    res.status(500).json({
      message: "Error fetching affected materiels",
      success: false
    });
  }
});

router.put('/receive-materiel', authMiddleware, jsonParser, async (req, res) => {
  try {
    const materiel = req.body;
    // Update the materiel status or any other necessary changes
    const updatedMateriel = await Materiel.findByIdAndUpdate(materiel._id, { status: 'received' }, { new: true });

    const user = await User.findOne({ role:'logistique' });
    console.log(user,'ooooo');
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "received-list-materiel",
        message: `The materiel has been received to ${materiel._id} `,
        onClickPath: "/logitique",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }

    res.status(200).json({
      updatedMateriel,
      message: "Materiel received successfully.",
      success: true
    });
  } catch (error) {
    console.error("Error receiving materiel: ", error);
    res.status(500).json({
      message: "Error receiving materiel.",
      success: false
    });
  }
});

module.exports = router;
