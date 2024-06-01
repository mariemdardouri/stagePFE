const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const user = express();
const User = require("../models/userModel");
const Request = require("../models/requestModel");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require("fs");
const csvtojson = require("csvtojson");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

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

router.post("/add-request", authMiddleware, jsonParser, async (req, res) => {
  try {
    const { firstName, lastName, cin, email, phoneNumber, role } = req.body;

    const hashedPassword = await bcrypt.hash(cin, 10);
    const newRequest = new Request({
      firstName: firstName,
      lastName: lastName,
      cin: cin,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      role: role,
      responsableSite: req.body.id,
      status: "pending",
    });
    await newRequest.save();
    const user = await User.findOne({ role: "admin" });
    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-user",
      message: "Vous avez reçu une nouvelle demande d'utilisateur",
      onClickPath: "/admin/demande",
    });
    user.unseenNotifications = unseenNotifications;
    await user.save();
    res
      .status(201)
      .json({ message: "Demande ajouté avec succès", success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du demande", success: false });
  }
});

router.post("/uploadCSV", upload.single("file"), authMiddleware, async (req, res) => {
  try {
    const userId = req.body.id;
    console.log(userId, "User ID from request body");

    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    const user = await User.findById(userId);
    console.log(user, "User object");

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const csvData = [];
    console.log(req.file.path, "File path");

    const jsonObj = await csvtojson().fromFile(req.file.path);
    console.log(jsonObj, "CSV JSON Object");

    for (const row of jsonObj) {
      const hashedPassword = await bcrypt.hash(row.cin, 10);
      csvData.push({
        firstName: row.firstName,
        lastName: row.lastName,
        cin: row.cin,
        email: row.email,
        phoneNumber: row.phoneNumber,
        password: hashedPassword,
        role: row.role,
        responsableSite: userId,
        status: "pending",
      });
    }
    console.log(csvData, "CSV Data");

    if (csvData.length > 0) {
      await Request.insertMany(csvData);

      const adminUser = await User.findOne({ role: "admin" });
      console.log(adminUser, "Admin user");

      if (adminUser) {
        adminUser.unseenNotifications = adminUser.unseenNotifications || [];
        adminUser.unseenNotifications.push({
          type: "request-list",
          message: "Une nouvelle liste de demandes a été envoyée",
          onClickPath: "/admin/demande",
        });
        await adminUser.save();
      }

      res.status(200).json({ message: "Données CSV importées avec succès", success: true });
    } else {
      console.error("Aucune donnée valide à importer");
      res.status(400).json({ message: "Aucune donnée valide à importer", success: false });
    }
  } catch (error) {
    console.error("Erreur lors de l'importation des données CSV:", error);
    res.status(500).json({ message: "Erreur lors de l'importation des données CSV", success: false });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression du fichier téléchargé:", err);
      }
    });
  }
});

router.get("/request", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" });
    res.status(200).json(requests);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes de demande:",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des demandes de demande",
        success: false,
      });
  }
});

router.put(
  "/update-request/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const updatedRequest = await Request.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        updatedRequest,
        message: "La demande a été mise à jour avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du demande:", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la mise à jour du demande",
          success: false,
        });
    }
  }
);

router.delete(
  "/delete-request/:id",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    try {
      const deletedRequest = await Request.findByIdAndDelete(req.params.id);
      res.status(200).json({
        deletedRequest,
        message: "La demande a été supprimée avec succès",
        success: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du demande:", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression du demande",
          success: false,
        });
    }
  }
);

router.put("/accept-user/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findByIdAndUpdate(
      requestId,
      { status: "activate" },
      { new: true }
    );

    if (!request) {
      return res
        .status(404)
        .json({ message: "Demande introuvable", success: false });
    }

    const newUser = new User({
      firstName: request.firstName,
      lastName: request.lastName,
      cin: request.cin,
      email: request.email,
      phoneNumber: request.phoneNumber,
      password: request.password,
      role: request.role,
      status: "activate",
      seenNotifications: request.seenNotifications,
      unseenNotifications: request.unseenNotifications,
    });

    newUser.unseenNotifications.push({
      type: "user-account-activate",
      message: "Votre compte a été accepté",
      onClickPath: "/agent",
    });

    await newUser.save();
    res
      .status(200)
      .json({ message: "Utilisateur créé avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'utilisateur:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de l'acceptation de l'utilisateur",
        success: false,
      });
  }
});
router.put("/reject-request/:id",authMiddleware,jsonParser,async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log(requestId, "llllllll");
    const request = await Request.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: "Demande non trouvé", success: false });
    }

    res.status(200).json({ message: "Demande rejeter avec succès", success: true });
  } catch (error) {
    console.error("Erreur lors de la réjection du demande:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la réjection du emande", success: false });
  }
}
);

router.get("/get-request", async (req, res) => {
  try {
    const request = await Request.findById(req.body.id);
    res.status(200).json(request);
  } catch (error) {
    console.error("Erreur lors de la récupération du demande:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération du demande",
        success: false,
      });
  }
});

router.get(
  "/get-requests-by-responsable-site",
  authMiddleware,
  async (req, res) => {
    try {
      const requests = await Request.find({ responsableSite: req.body.id });
      res.status(200).json({ requests });
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des demandes",
          success: false,
        });
    }
  }
);

router.get("/get-all-requests", jsonParser, async (req, res) => {
  try {
    const data = await Request.find({}).populate('responsableSite');
    res.status(200).json({ data });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        success: false,
      });
  }
});

module.exports = router;
