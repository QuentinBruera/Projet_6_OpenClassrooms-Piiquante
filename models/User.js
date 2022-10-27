// Importation de mongoose depuis "./node_modules" (il faut l'importer avec npm)
const mongoose = require("mongoose");

// Importation de "mongoose-unique-validator" depuis "../node_modules" (il faut l'importer avec npm : npm install --save mongoose-unique-validator). Il sert à rajouter une "sécurité" pour "unique: true" de l'email
const uniqueValidator = require("mongoose-unique-validator");

// Création du Schema pour les comptes utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// On applique "mongoose-unique-validator" au Schema "userSchema"
userSchema.plugin(uniqueValidator);

// Exportation du Schema des comptes utilisateurs
module.exports = mongoose.model("User", userSchema);
