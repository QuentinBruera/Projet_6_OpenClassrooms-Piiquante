// Importation du models/Sauce de la base de donnée MongoDB
const Sauce = require("../models/Sauce");

// Importation du package fs (depuis node) qui expose des méthodes pour interagir avec le système de fichiers du serveur. fs  signifie « file system » (soit « système de fichiers », en français). Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require("fs");

// Middleware avec une méthode POST pour créer (poster) une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    // On supprime l'_id de la sauce car il va être donné directement par la base de donnée MangoDB
    delete sauceObject._id;

    // On supprime le champ _userId de la requête envoyée par le client car nous ne devons pas lui faire confiance (rien ne l’empêcherait de nous passer le userId d’une autre personne). On le remplace en base de données par le _userId extrait du token par le middleware d’authentification
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });
    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => res.status(400).json({ error }));
};

// Middleware avec une méthode PUT pour modifier UNE sauce choisie
exports.modifySauce = (req, res, next) => {
    // Création de l'imageUrl si un nouvelle image est postée
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    // On supprime le champ _userId envoyé par le client afin d’éviter de changer son propriétaire.
    delete sauceObject._userId;

    // Si un nouvelle image est postée, localise et supprime l'ancienne
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.userId != req.auth.userId) {
                    res.status(401).json({ message: "Non-autorisé !" });
                } else {
                    // Récupère l'ancinne photo à supprimer
                    const filename = sauce.imageUrl.split("/images/")[1];
                    // Supprime l'image du dossier "../images"
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            })
            .catch((error) =>
                res.status(404).json({ message: "Sauce non trouvé" })
            );
    }

    // Envoi les modifications effectué
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé !" });
            } else {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Objet modifié !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

// Middleware avec une méthode DELETE pour supprimer UNE sauce choisie
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé !" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: "Objet suprrimé !" })
                        )
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

// Middleware avec une méthode GET pour récupérer UNE sauce choisie
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// Middleware avec une méthode GET pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json(error));
};
