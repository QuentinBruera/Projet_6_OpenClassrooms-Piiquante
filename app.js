// Importation du framework express depuis "./node_modules"
const express = require("express");

// const helmet = require("helmet");

// Importation du package dotenv depuis "./node_modules" (il faut l'importer avec npm : npm install dotenv --save ). Il sert à utiliser le fichier ".env" pour sécuriser l'accé à la base de donnée
require("dotenv").config();
// console.log(process.env.DATA_BASE);

// Importation de mongoose depuis "./node_modules" (il faut l'importer avec npm : npm install mongoose). Il sert à faire le lien avec la base de donnée de MongoDB et le site
const mongoose = require("mongoose");

// Importation de la base de donnée depuis MongoDB
mongoose
    .connect(`${process.env.DATA_BASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Cette variable sert à créer une application express
const app = express();
//  Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON. Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
app.use(express.json());

// app.use(helmet());

/*
!--- BODYPARSER fait la même chose que "app.use(express.json())" mais c'est un veille façon de faire ---!
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
*/

// Ajout des headers (à l'objet réponse) pour donner les accés d'utilisation de l'API aux utilisateurs. Il faut ajouter des headers (pour éviter les erreurs CORS) quand l'API et les requêtes sont pas stockés au même endroit.
app.use((req, res, next) => {
    // Permet d'accéder à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );

    // Permet d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Importation des router
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Importation du module "path", il permet de travailler avec des répertoires et des chemins de fichiers.
const path = require("path");

// Enregistrement des router pour déclarer nos routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// Exportation de la variable "const app = express();" pour pouvoir l'utiliser dans d'autres fichiers
module.exports = app;
