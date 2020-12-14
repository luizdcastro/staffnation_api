const express = require("express");
const router = express.Router();
const authBusinessController = require("../controllers/authBusinessController");

router.post("/registrar", authBusinessController.register);
router.post("/login", authBusinessController.login);
router.post('/forgotPassword', authBusinessController.forgotPassword);

module.exports = router;