const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Materiel = require("../models/materielModel");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require("fs");
const csvtojson = require("csvtojson");
const multer = require("multer");
const path = require("path");
const user = express();

user.use(jsonParser);
user.use(bodyParser.urlencoded({ extended: true }));
user.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/add-materiel", authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const newMateriel = new Materiel({
      ...req.body,
      fournisseur: user.firstName + " " + user.lastName,
      numLot: req.body.numLot,
      numInv: "",
    });
    await newMateriel.save();
    const deploiementUser = await User.findOne({ role: "deploiement" });
    const unseenNotifications = deploiementUser.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-list-matetiel",
      message: `Vous avez reçu un nouveau matériel par le fournisseur ${newMateriel.fournisseur}`,
      onClickPath: "/deploiement",
    });
    deploiementUser.unseenNotifications = unseenNotifications;
    await deploiementUser.save();
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
      .json({
        message: "Erreur lors de la récupération des matériels",
        success: false,
      });
  }
});

router.get(
  "/get-materiel-by-fournisseur",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.id });
      const materiel = await Materiel.find({
        fournisseur: user.firstName + " " + user.lastName,
      });
      res.status(200).json({ materiel });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des matériels",
          success: false,
        });
    }
  }
);

router.put(
  "/update-materiel/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const updatedMateriel = await Materiel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        updatedMateriel,
        message: "Matériel a été mis à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du matériel: ", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la mise à jour du matériel",
          success: false,
        });
    }
  }
);
router.get("/lotNumbers", authMiddleware, async (req, res) => {
  try {
    const lotNumbers = await Materiel.distinct("numLot");
    res.status(200).json(lotNumbers);
  } catch (error) {
    console.error("Erreur lors de la récupération des numéros de lot:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des numéros de lot",
        success: false,
      });
  }
});

router.put("/add-numInv/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const addNumInv = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const user = await User.findOne({ role: "logistique" });
    if (user) {
      const unseenNotifications = user.unseenNotifications || [];
      unseenNotifications.push({
        type: "numInv-added",
        message: `Le responsable d'approvisionnement a ajouté le numéro d'inventaire au matériel de la catégorie "${addNumInv.categorie}", de la nature "${addNumInv.nature}" et du numéro de série "${addNumInv.numSerie}"`,
        onClickPath: "/logistique",
      });
      user.unseenNotifications = unseenNotifications;
      await user.save();
    }
    res.status(200).json({
      addNumInv,
      message: "Le numéro d'inventaire a été afféctuer avec succès",
      success: true,
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'affectation du numéro d'inventaire: ",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de l'affectation du numéro d'inventaire",
        success: false,
      });
  }
});

router.put(
  "/accept-materiels",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const updatedMateriels = await Materiel.updateMany(
        { _id: { $in: req.body.map((materiel) => materiel._id) } },
        { $set: { status: "accept" } },
        { multi: true }
      );

      const user = await User.findOne({ role: "approvisionnement" });
      console.log(user, "ooooo");
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "accepted-list-materiel",
          message: `La liste des matériels a été acceptée par le responsable de déploiement `,
          onClickPath: "/approvisionnement",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }
      res.status(200).json({
        updatedMateriels,
        message: "Les matériels ont été acceptée  avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de l' acceptation  du matériel: ", error);
      res.status(500).json({
        message: "Erreur lors de l' acceptation du matériel",
        success: false,
      });
    }
  }
);
router.put(
  "/reject-materiels",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const materielsIds = req.body;
      const updatedMateriels = await Materiel.updateMany(
        { _id: { $in: materielsIds } },
        { $set: { status: "rejected" } },
        { multi: true }
      );
      const user = await User.findOne({ role: "approvisionnement" });
      console.log(user, "ooooo");
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "rejected-list-materiel",
          message:
            "La liste des matériels a été rejetée par le responsable de déploiement",
          onClickPath: "/approvisionnement",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }

      res.status(200).json({
        updatedMateriels,
        message: "Les matériels ont été rejetés avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors du rejet des matériels: ", error);
      res.status(500).json({
        message: "Erreur lors du rejet des matériels",
        success: false,
      });
    }
  }
);

router.delete(
  "/delete-materiel/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const deletedMateriel = await Materiel.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({
          deletedMateriel,
          message: "Le matériel a été supprimé avec succès",
          success: true,
        });
    } catch (error) {
      console.error("Erreur lors de la suppression du matériel: ", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression du matériel",
          success: false,
        });
    }
  }
);
router.put(
  "/affecter-materiel/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const updatedMateriel = await Materiel.findByIdAndUpdate(
        req.params.id,
        { agent: req.body.agent },
        { new: true }
      );

      if (!updatedMateriel) {
        return res
          .status(404)
          .json({ message: "Matériel non trouvé", success: false });
      }
      const materiel = await Materiel.findById(req.params.id);
      const user = await User.findById(req.body.agent);
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "materiel-assigned",
          message: `Le responsable logistique a affecté le matériel de la catégorie "${materiel.categorie}" et de la nature "${materiel.nature}" pour vous`,
          onClickPath: "/agent",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }

      res.status(200).json({
        updatedMateriel,
        message: "Matériel affecté avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'affectation des matériels: ", error);
      res.status(500).json({
        message: "Erreur lors de l'affectation des matériels",
        success: false,
      });
    }
  }
);

router.get(
  "/get-materiels-affected-to-agent",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.id });

      const affectedMateriels = await Materiel.find({ agent: user._id });

      res.status(200).json(affectedMateriels);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des matériaux concernés: ",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la récupération des matériaux concernés",
        success: false,
      });
    }
  }
);

router.put(
  "/receive-materiel",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const materiel = req.body;
      const updatedMateriel = await Materiel.findByIdAndUpdate(
        materiel._id,
        { status: "received" },
        { new: true }
      );

      const agent = await User.findById(req.body.id);

      const user = await User.findOne({ role: "logistique" });
      console.log(user, "oooo");
      if (user) {
        const unseenNotifications = user.unseenNotifications || [];
        unseenNotifications.push({
          type: "received-list-materiel",
          message: `Le matériel de la catégorie "${
            materiel.categorie
          }" et de la nature "${materiel.nature}"est reçu à l'agent "${
            agent.firstName + " " + agent.lastName
          }" `,
          onClickPath: "/logistique",
        });
        user.unseenNotifications = unseenNotifications;
        await user.save();
      }

      res.status(200).json({
        updatedMateriel,
        message: "Matériel reçu avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur de réception du matériel: ", error);
      res.status(500).json({
        message: "Erreur de réception du matériel",
        success: false,
      });
    }
  }
);
/*router.post("/uploadCSV", upload.single("file"), async (req, res) => {
  const user = await User.findOne(req.body.id);
  console.log(user,'user');
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé", success: false });
  }
 
  const csvData = [];
  console.log(req.file.path, "pathh");
  csvtojson().fromFile(req.file.path).then(async (jsonObj) => {
      console.log(jsonObj);
      for (const row of jsonObj) {csvData.push({
          categorie: row.categorie,
          nature: row.nature,
          numSerie: row.numSerie,  
          fournisseur: user.firstName+ ' ' +user.lastName,
          numLot: row.numLot,
        });
      }
      
      console.log(csvData, "csvvvv");
      try {
        if (csvData.length > 0) {
          await Materiel.insertMany(csvData);
          const userDeploiement = await User.findOne({ role:"deploiement"});
          if (userDeploiement) {
            userDeploiement.unseenNotifications = userDeploiement.unseenNotifications || [];
            userDeploiement.unseenNotifications.push({
              type: "materiel-list",
              message: `Une nouvelle liste de matériel a été envoyée par fournisseur ${user.firstName + ' '+user.lastName} `,
              onClickPath: "/deploiement",
            });
            await userDeploiement.save();
          }
          res.status(200).json({ message: "Données CSV importées avec succès" ,success:true });
        } else {
          console.error("Aucune donnée valide à importer");
          res.status(400).json({ message: "Aucune donnée valide à importer",success:false });
        }
      } catch (error) {
        console.error("Erreur lors de l'importation des données CSV:", error);
        res.status(500).json({ message: "Erreur lors de l'importation des données CSV" ,success:false });
      } finally {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier téléchargé:", err);
          }
        });
      }
    });
});*/
router.post("/uploadCSV", upload.single("file"),authMiddleware, async (req, res) => {
  try{
  const userId = req.body.id;
  console.log(userId,'userId');
  if (!userId) {
    return res
      .status(400)
      .json({ message: "L'ID utilisateur est requis", success: false });
  }

  const user = await User.findById(userId);
  console.log(user, "User object");

  if (!user) {
    return res
      .status(404)
      .json({ message: "Utilisateur non trouvé", success: false });
  }
  console.log(user, "user");

  const csvData = [];
  console.log(csvData,'csvData');
  const jsonObj = await csvtojson().fromFile(req.file.path);
    console.log(jsonObj, "CSV JSON Object");

    const existingLotNumbers = await Materiel.distinct("numLot");
      let maxLotNumber =
        existingLotNumbers.length > 0 ? Math.max(...existingLotNumbers) : 0;

      for (const row of jsonObj) {
        csvData.push({
          categorie: row.categorie,
          nature: row.nature,
          numSerie: row.numSerie,
          fournisseur: user.firstName + " " + user.lastName,
          numLot: maxLotNumber + 1,
        });
      }

       console.log(csvData, "CSV Data");

    if (csvData.length > 0) {
      await Materiel.insertMany(csvData);

      const userDeploiement = await User.findOne({ role: "deploiement" });
      console.log(userDeploiement, "Admin user");

      if (userDeploiement) {
        userDeploiement.unseenNotifications =
          userDeploiement.unseenNotifications || [];
        userDeploiement.unseenNotifications.push({
          type: "materiel-list",
          message: `Le fournisseur ${
            user.firstName + " " + user.lastName
          } a envoyé une nouvelle liste de matériel `,
          onClickPath: "/deploiement",
        });
        await userDeploiement.save();
      }

      res.status(200).json({ message: "Données CSV importées avec succès", success: true });
    } else {
      console.error("Aucune donnée valide à importer");
      res.status(400).json({ message: "Aucune donnée valide à importer", success: false });
    }
 
      } catch (error) {
        console.error("Erreur lors de l'importation des données CSV:", error);
        res
          .status(500)
          .json({
            message: "Erreur lors de l'importation des données CSV",
            success: false,
          });
      } finally {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression du fichier téléchargé:",
              err
            );
          }
        });
      }
    });
module.exports = router;
