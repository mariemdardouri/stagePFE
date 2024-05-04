const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const user = express();
const User = require("../models/userModel");
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
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Error fetching users", success: false });
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
    console.error("Error updating user: ", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      success: false,
    });
  }
});

router.put("/accept-user/:id", authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );
    res
      .status(200)
      .json({ user, message: "User accepted successfully", success: true });
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).json({ message: "Error accepting user", success: false });
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
      };
      console.log(csvData, "csvvvv");
    

      try {
        if (csvData.length > 0) {
          User.insertMany(csvData);
          res.status(200).json({ message: "CSV data imported successfully" });
        } else {
          console.error("No valid data to import");
          res.status(400).json({ message: "No valid data to import" });
        }
      } catch (error) {
        console.error("Error importing CSV data:", error);
        res.status(500).json({ message: "Error importing CSV data" });
      } finally {
        // Clean up the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting uploaded file:", err);
          }
        });
      }
    });
  })

module.exports = router;
