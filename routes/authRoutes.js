const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/registrar", authController.register);
router.post("/login", authController.login);
router.post('/forgotPassword', authController.forgotPassword);

module.exports = router;
