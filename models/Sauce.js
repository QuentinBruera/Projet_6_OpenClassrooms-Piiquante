const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model("Sauce", sauceSchema);