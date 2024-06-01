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
    const { materielId,description } = req.body;  
    const materiel = await Materiel.findById(materielId);
    console.log(materielId,'id');
    if (!materiel) {
      return res.status(404).json({ message: "Matériel introuvable", success: false });
    }
    console.log(materiel,'materiel');
    const user = await User.findById(req.body.id); 
    console.log(user,'userrrrrrrrrrr');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable", success: false });
    }
    
    const newReclamation = new Claim({ materiel: materiel._id, user: user._id, description });
    console.log(newReclamation,'newReclamation');
    await newReclamation.save();

    const logistiqueUser = await User.findOne({ role: 'logistique' });
    const unseenNotifications = logistiqueUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-list-matetiel",
      message: `Vous avez reçu une réclamation de description "${description}"`,
      onClickPath: "/logistique/réclamation",
    });
    logistiqueUser.unseenNotifications = unseenNotifications;
    await logistiqueUser.save();
    res.status(201).json({ message: "Réclamation créée avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la création de la réclamation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la réclamation", success: false });
  }
});



router.get("/get-all-claims",jsonParser, async (req, res) => {
  try {
    const claims = await Claim.find({}).populate('materiel').populate('user');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Erreur lors de la récupération des réclamations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", success: false });
  }
});

router.get("/get-claims-by-materiel/:id",authMiddleware,jsonParser,async (req, res) => {
  try {
   
    const user = req.body.id;
    console.log(user,'userId');
    if (!user) {
      return res.status(400).json({ message: "ID de l'utilisateur manquant", success: false });
    }

    const claims = await Claim.find({ user: user }).populate('materiel').populate('user');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Erreur lors de la récupération des réclamations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", success: false });
  }
});

router.post('/send-to-fournisseur',authMiddleware,jsonParser,async (req, res) => {
  try {
    const claim = req.body;
    const updatedClaim = await Claim.findByIdAndUpdate(claim._id, { status: 'sent to fournisseur' }, { new: true }).populate('materiel').populate('user');

    const fournisseurUser = await User.findOne({ role: 'fournisseur' });
    const unseenNotifications = fournisseurUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "send-to-fournisseur",
      message: `Une réclamation de description "${claim.description}" a été envoyée par le responsable logistique`,
      onClickPath: "/fournisseur/réclamation",
    });
    fournisseurUser.unseenNotifications = unseenNotifications;
    await fournisseurUser.save();
    res.status(200).json(updatedClaim);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réclamation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la réclamation', success: false });
  }
});
router.get('/get-claims-for-fournisseur',jsonParser, async (req, res) => {
  try {

    const claims = await Claim.find({ status: "sent to fournisseur"} ).populate('materiel').populate('user');
    res.status(200).json(claims);
  } catch (error) {
    console.error("Erreur lors de la récupération des réclamations:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des réclamations", success: false });
  }
});

router.put('/receive-claim', authMiddleware, jsonParser, async (req, res) => {
  try {
    const claim = req.body;

    const updatedClaim = await Claim.findByIdAndUpdate(claim._id, { status: 'received' }, { new: true });

    const user = await User.findOne({ role:'agent' });
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "received-claim",
        message: `Réclamation est dans le process par le fournisseur ${claim.materiel.fournisseur}`,
        onClickPath: "/agent/réclamation",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }

    res.status(200).json({updatedClaim,message: "Réclamation reçu avec succès",success: true});
  } catch (error) {
    console.error("Erreur de réception du réclamation: ", error);
    res.status(500).json({
      message: "Erreur de réception du réclamation",
      success: false
    });
  }
});

router.put('/accept-claim', authMiddleware, jsonParser, async (req, res) => {
  try {
    const claim = req.body;

    const updatedClaim = await Claim.findByIdAndUpdate(claim._id, { status: 'accepted' }, { new: true });

    const user = await User.findOne({ role:'logistique' });
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "received-list-materiel",
        message: `Réclamation est accompli par l'agent ${claim.user.firstName+' '+claim.user.lastName } `,
        onClickPath: "/logitique/réclamation",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }
    res.status(200).json({ updatedClaim, message: "Réclamation acceptée avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la réclamation:", error);
    res.status(500).json({ message: "Erreur lors de l'acceptation de la réclamation", success: false });
  }
});
router.put('/reject-materiels', authMiddleware, jsonParser, async (req, res) => {
  try{
    const { claimId } = req.body;

    const updatedClaim = await Claim.findByIdAndUpdate(claimId, { status: 'rejected' }, { new: true });

    const user = await User.findOne({ role:'logistique' });
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "received-list-materiel",
        message: `Claim a ete recus et dans le process`,
        onClickPath: "/logitique/réclamation",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }
    res.status(200).json({updatedClaim,message: "La réclamation non vérifié ont été rejetés avec succès",success: true });
  } catch (error) {
    console.error("Erreur lors du rejet de réclamation: ", error);
    res.status(500).json({message: "Erreur lors du rejet de réclamation",success: false});
  }
});

router.put('/update-claim/:id', authMiddleware, jsonParser, async (req, res) => {
  try {

    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ updatedClaim, message: "Réclamation mise à jour avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réclamation:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réclamation", success: false });
  }
});

router.delete('/delete-claim/:id', authMiddleware, jsonParser, async (req, res) => {
  try {
    const deletedClaim = await Claim.findByIdAndDelete(req.params.id);

    res.status(200).json({deletedClaim, message: "Réclamation supprimée avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réclamation:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la réclamation", success: false });
  }
});

module.exports = router;
