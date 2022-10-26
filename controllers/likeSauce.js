// Importation du models/Sauce de la base de donnée MongoDB
const Sauce = require("../models/Sauce");

exports.likeSauce = (req, res, next) => {
    console.log("Je suis dans le controller likeSauce");

    // Affichage du req.body
    /*
    Format du req.body attendu :
    {
    "userId": "String",
    "like": Number (-1 || 0 || 1)
    }
    */
    console.log("--> Contenu req.body - likeSauce");
    console.log(req.body);

    // Récupèrer l'id de la sauce dans l'url de la requête
    console.log("---> Contenu req.paramas - likeSauce");
    console.log(req.params);

    // L'id du req.paramas est mis au format _id pour allez le chercher dans mangoDB
    console.log("---> id en _id");
    console.log({ _id: req.params.id });

    // Aller chercher l'objet dans la base de donnée
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("--> Contenu résultat de la promesse");
            console.log(sauce);

            // Méthode JavaScript includes()
            // Opérateur mangoDB : $inc, $push, $pull

            // Vérifie si userId == userId du TOKEN
            if (req.body.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé" });
            } else {
                // Si je veux liker : like = 1
                if (
                    req.body.like === 1 &&
                    !sauce.usersLiked.includes(req.body.userId)
                ) {
                    console.log("userId n'est pas dans usersLiked && like = 1");
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1, likes: 1 },
                                $pull: { usersDisliked: req.body.userId },
                                $push: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like -1" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like 1" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                }

                // Si je veux disliker : like = -1
                if (
                    req.body.like === -1 &&
                    !sauce.usersDisliked.includes(req.body.userId)
                ) {
                    console.log(
                        "userId n'est pas dans usersDisliked && like = -1"
                    );
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1, likes: -1 },
                                $push: { usersDisliked: req.body.userId },
                                $pull: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like -1" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like -1" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                }

                // Si je veux enlever mon like ou mon dislike : like = 0
                if (req.body.like === 0) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        console.log("userId est dans usersLiked && like = 0");

                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like 0" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        console.log(
                            "userId est dans usersDisliked && like = 0"
                        );

                        // Mise à jour de la sauce dans la base de donnée
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                            }
                        )
                            .then(() =>
                                res.status(201).json({ message: "like 0" })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                }
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

// Première version

// // Si userliked est FALSE && like === 1 (likes = +1)
// if (
//     !sauce.usersLiked.includes(req.body.userId) &&
//     req.body.like === 1
// ) {
//     console.log("userId n'est pas dans usersLiked && like = 1");

//     // Mise à jour de la sauce dans la base de donnée
//     Sauce.updateOne(
//         { _id: req.params.id },
//         {
//             $inc: { likes: 1 },
//             $push: { usersLiked: req.body.userId },
//         }
//     )
//         .then(() => res.status(201).json({ message: "like 1" }))
//         .catch((error) => res.status(400).json({ error }));
// }

// // Si like = 0 (likes = -1)
// if (
//     sauce.usersLiked.includes(req.body.userId) &&
//     req.body.like === 0
// ) {
//     console.log("userId est dans usersLiked && like = 0");

//     // Mise à jour de la sauce dans la base de donnée
//     Sauce.updateOne(
//         { _id: req.params.id },
//         {
//             $inc: { likes: -1 },
//             $pull: { usersLiked: req.body.userId },
//         }
//     )
//         .then(() => res.status(201).json({ message: "like 0" }))
//         .catch((error) => res.status(400).json({ error }));
// }

// // Si usersDisliked est FALSE && like === -1 (dislikes = +1)
// if (
//     !sauce.usersDisliked.includes(req.body.userId) &&
//     req.body.like === -1
// ) {
//     console.log("userId n'est pas dans usersDisliked && like = -1");

//     // Mise à jour de la sauce dans la base de donnée
//     Sauce.updateOne(
//         { _id: req.params.id },
//         {
//             $inc: { dislikes: 1 },
//             $push: { usersDisliked: req.body.userId },
//         }
//     )
//         .then(() => res.status(201).json({ message: "like -1" }))
//         .catch((error) => res.status(400).json({ error }));
// }

// //Like = 0 (dislikes = -1)
// if (
//     sauce.usersDisliked.includes(req.body.userId) &&
//     req.body.like === 0
// ) {
//     console.log("userId est dans usersDisliked && like = 0");

//     // Mise à jour de la sauce dans la base de donnée
//     Sauce.updateOne(
//         { _id: req.params.id },
//         {
//             $inc: { dislikes: -1 },
//             $pull: { usersDisliked: req.body.userId },
//         }
//     )
//         .then(() => res.status(201).json({ message: "like 0" }))
//         .catch((error) => res.status(400).json({ error }));
// }
