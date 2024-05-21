const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(jsonParser);

router.post("/login", jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "L'utilisateur n'a pas trouvé" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Le mot de passe est incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id, role: user.role }, "PFE", {
        expiresIn: "1d",
      });
      res.status(200).json({message: "Connexion réussie",success: true,token: token,role: user.role,});
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: "Erreur de connexion", success: false });
  }
});

router.post("/register", jsonParser, async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).json({ message: "L'utilisateur existe déjà", success: false });
    }
    console.log("body data", req.body);
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res.status(200).json({ message: "Utilisateur créé avec succès", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur interne du serveur", success: false });
  }
});
router.post("/get-user-info", authMiddleware, jsonParser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      return res.status(401).json({ message: "L'utilisateur n'a pas trouvé" });
    }
    if (user.status === "desactivate") {
      return res.status(200).json({ message: "Ce compte est désactivé",success: false });
    }
    res.status(200).json({
      success: true,
      token: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erreur lors de l'obtention des informations sur l'utilisateur", error: err.message });
  }
});

module.exports = router;
