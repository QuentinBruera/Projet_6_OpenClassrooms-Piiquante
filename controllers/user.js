// Importation du models/User de la base de donnée MongoDB
const User = require("../models/User");

// Importation de bcrypt depuis "../node_modules" (il faut l'importer avec npm : npm install --save bcrypt). Il sert à crypter les mots de passe.
const bcrypt = require("bcrypt");

// Importation de jsonwebtoken depuis "../node_modules" (il faut l'importer avec npm : npm install --save jsonwebtoken). Il sert à créer des TOKEN et les verifier
const jwt = require("jsonwebtoken");

// Middleware avec une méthode POST pour créer un nouveau compte utilisateur
exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé !" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// Middleware avec une méthode POST pour ce connecter avec son compte utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user === null) {
                res.status(401).json({
                    message: "Paire indentifiant/mot de passe incorrecte",
                });
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({
                                message:
                                    "Paire indentifiant/mot de passe incorrecte",
                            });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    "RANDOM_TOKEN_SECRET",
                                    { expiresIn: "24h" }
                                ),
                            });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
