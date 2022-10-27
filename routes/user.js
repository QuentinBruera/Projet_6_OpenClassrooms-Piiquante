// Importation d'express
const express = require("express");

// Création du router
const router = express.Router();

// Importation du controller/user.js
const uslerCtrl = require("../controllers/user");

// Les routes
router.post("/signup", uslerCtrl.signup);
router.post("/login", uslerCtrl.login);

// Exportation du module des routes
module.exports = router;
