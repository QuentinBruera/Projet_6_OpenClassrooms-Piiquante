// Importation d'express
const express = require("express");

const auth = require("../middleware/auth");

// La fonction Router()
const router = express.Router();

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

// Exportation du module
module.exports = router;
