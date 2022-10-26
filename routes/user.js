const express = require("express");
const router = express.Router();

const uslerCtrl = require("../controllers/user");

router.post("/signup", uslerCtrl.signup);
router.post("/login", uslerCtrl.login);

module.exports = router;
