const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Materiel = require("../models/materielModel");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.post("/add-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const newMateriel = new Materiel({
      ...req.body,
      fournisseur : user.firstName + " " + user.lastName,
      numInv:''
    });
    await newMateriel.save();
    const deploiementUser = await User.findOne({ role: 'deploiement' });
    const unseenNotifications = deploiementUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-list-matetiel",
      message: 'Vous avez reçu une nouvelle liste de matériel',
      onClickPath: "/deploiement",
    });
    deploiementUser.unseenNotifications = unseenNotifications;
    await deploiementUser.save();
    res.status(201).json({ message: "Matériel ajouté avec succès", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du matériel", success: false });
  }
});

router.get("/get-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    const materiel = await Materiel.find({});
    res.status(200).json({ materiel });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des matériels", success: false });
  }
});
router.get("/get-materiel-by-fournisseur", authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    const materiel = await Materiel.find({fournisseur: user.firstName + " " + user.lastName});
    res.status(200).json({ materiel });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des matériels", success: false });
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
          message: "Le responsable de l'approvisionnement a ajouté numéro d'inventaire au matériel",
          onClickPath: "/logistique",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }
      res.status(200).json({
        updatedMateriel,
        message: "Le matériel a été mis à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du matériel: ", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du matériel", success: false });
    }
  }
);
router.put('/accept-materiels', authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedMateriels = await Materiel.updateMany(
      { _id: { $in: req.body.map(materiel => materiel._id) } },
      { $set: { status: 'accept' } },
      { multi: true }
    );
    const user = await User.findOne({ role:'approvisionnement' });
    console.log(user,'ooooo');
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "accepted-list-materiel",
        message: 'La liste des matériels a été acceptée',
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
    console.error("Erreur lors de la mise à jour du matériel: ", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du matériel",
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
        message: 'La liste des matériels a été rejetée',
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
    console.error("Erreur lors du rejet des matériels: ", error);
    res.status(500).json({
      message: "Erreur lors du rejet des matériels",
      success: false
    });
  }
});

router.delete( "/delete-materiel/:id", authMiddleware, jsonParser,async (req, res) => {
    try {
      const deletedMateriel = await Materiel.findByIdAndDelete(req.params.id);
      res.status(200).json({deletedMateriel,message: "Le matériel a été supprimé avec succès",success: true,});
    } catch (error) {
      console.error("Erreur lors de la suppression du matériel: ", error);
      res.status(500).json({message: "Erreur lors de la suppression du matériel",success: false});
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
    console.error("Erreur lors de l'affectation des matériels: ", error);
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
    console.error("Erreur lors de la récupération des matériaux concernés: ", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des matériaux concernés",
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
    console.log(user,'oooo');
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "received-list-materiel",
        message: `Le matériel a été reçu à ${materiel.categorie} `,
        onClickPath: "/logitique",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }

    res.status(200).json({
      updatedMateriel,
      message: "Matériel reçu avec succès",
      success: true
    });
  } catch (error) {
    console.error("Erreur de réception du matériel: ", error);
    res.status(500).json({
      message: "Erreur de réception du matériel",
      success: false
    });
  }
});

module.exports = router;
