// Importation de jsonwebtoken depuis "../node_modules" (il faut l'importer avec npm : npm install --save jsonwebtoken). Il sert à créer des TOKEN et les verifier
const jwt = require("jsonwebtoken");

// Middleware qui récupère de TOKEN de l'utilisateur pour le décoder et stocker l'userId pour pouvoir le comparer dans les middleware POST,PUT, DELETE...
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
