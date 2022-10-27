// Importation d'express
const express = require("express");

// Importation du middleware d'authentification
const auth = require("../middleware/auth");

// Création du router
const router = express.Router();

// Importation de la configuration de multer pour gérer les images
const multer = require("../middleware/multer-config");

// Importation du controller/sauce.js
const sauceCtrl = require("../controllers/sauce");

// Importation du controller/likeSauce.js
const likeCtrl = require("../controllers/likeSauce");

// Les routes
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

router.post("/:id/like", auth, likeCtrl.likeSauce);

// Exportation du module des routes
module.exports = router;
