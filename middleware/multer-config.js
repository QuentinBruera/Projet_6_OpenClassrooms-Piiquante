// Importation de multer depuis "../node_modules" (il faut l'importer avec npm : npm install --save multer). Il sert à gérer les fichiers télécharger (image, photos,etc...)
const multer = require("multer");

// Dictionnaire pour l'extension du nom de l'objet multer
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Objet de configuration pour multer
const storage = multer.diskStorage({
    // Gère la destination de sauvegarde du fichier
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    // Gère le nom du fichier lors de la sauvegarde
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

// Exporte la configuration de multer pour gérer les images postés
module.exports = multer({ storage }).single("image");
