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

router.get("/get-all-users", authMiddleware, jsonParser, async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json({ data });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs: ", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", success: false });
  }
});

router.put("/update-user/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      updatedUser,
      message: "l'utilisateur a été mis à jour avec succès",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur: ", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      success: false,
    });
  }
});

router.post("/uploadCSV", upload.single("file"), async (req, res) => {
  const csvData = [];
  console.log(req.file.path, "pathh");
  csvtojson()
    .fromFile(req.file.path)
    .then(async (jsonObj) => {
      console.log(jsonObj);
      for (const row of jsonObj) {
        const hashedPassword = await bcrypt.hash(row.cin, 10); // Hash the password using bcrypt
        csvData.push({
          firstName: row.firstName,
          lastName: row.lastName,
          cin: row.cin,
          email: row.email,
          phoneNumber: row.phoneNumber,
          password: hashedPassword, // Store the hashed password
          role: row.role,
          status: "pending",
        });
      }
      console.log(csvData, "csvvvv");
    
      try {
        if (csvData.length > 0) {
          const requests = await Request.insertMany(csvData);
          const user = await User.findOne({ role:"admin"});
          console.log(user,'iiiiii');
          if (user) {
            user.unseenNotifications = user.unseenNotifications || [];
            user.unseenNotifications.push({
              type: "request-list",
              message: "Une nouvelle liste de demandes a été envoyée",
              onClickPath: "/admin/request",
            });
            await user.save();
          }

          res.status(200).json({ requests ,message: "Données CSV importées avec succès" });
        } else {
          console.error("Aucune donnée valide à importer");
          res.status(400).json({ message: "Aucune donnée valide à importer",success:false });
        }
      } catch (error) {
        console.error("Erreur lors de l'importation des données CSV:", error);
        res.status(500).json({ message: "Erreur lors de l'importation des données CSV" });
      } finally {
        // Clean up the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier téléchargé:", err);
          }
        });
      }
    });
});

router.put( "/user-activate/:id", authMiddleware, jsonParser, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: "activate" },
        { new: true }
      );
      if (!user) {
        res
          .status(404)
          .json({ message: "utilisateur non trouvé", success: false });
      }
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "user-account-activate",
        message: 'Votre compte a été activé',
        onClickPath: "/notifications",
      });
      res.status(200).json({
          user,
          message: "l'utilisateur a été activé avec succès",
          success: true,
        });
    } catch (error) {
      console.error("Erreur lors de l'activation de l'utilisateur:", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de l'activation de l'utilisateur",
          success: false,
        });
    }
  }
);
router.put("/desactivate-user/:id",authMiddleware,jsonParser,async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId, "llllllll");
      const user = await User.findByIdAndUpdate(
        userId,
        { status: "desactivate" },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé", success: false });
      }

      res.status(200).json({ message: "Utilisateur désactivé avec succès", success: true });
    } catch (error) {
      console.error("Erreur lors de la désactivation de l'utilisateur:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la désactivation de l'utilisateur", success: false });
    }
  }
);

router.get("/get-users-by-role", authMiddleware, jsonParser, async (req, res) => {
  try {
    const users = await User.find({ role: "agentLogistique" });
    console.log(users, "mmmmm");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", success: false });
  }
});

router.get("/user-notifications", authMiddleware,jsonParser, async (req, res) => {
  try {
    console.log(req.body.id,'idd');
    const user = await User.findOne({ _id: req.body.id});
    console.log(user,'notifiiii');
    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", success: false });
    }

    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;

    res.status(200).json({ unseenNotifications, seenNotifications });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des notifications", success: false });
  }
});

router.get("/user-notifications-count", authMiddleware,jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    const unseenNotificationsCount = user.unseenNotifications.length;

    res.status(200).json({unseenNotificationsCount , success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération du nombre de notifications",
      success: false,
      error,
    });
  }
});

router.post("/mark-all-notifications-as-seen",authMiddleware,jsonParser,async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.id });
     
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      const unseenNotifications = user.unseenNotifications || [];
      const seenNotifications = user.seenNotifications || [];

      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res.status(200).json({
        success: true,
        message: "Toutes les notifications marquées comme vues",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Erreur marquant les notifications comme vues",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notifications", authMiddleware,jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Toutes les notifications effacées",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la suppression des notifications",
      success: false,
      error,
    });
  }
});

module.exports = router;
