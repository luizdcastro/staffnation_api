const express = require("express");
const router = express.Router();
const authUserController = require("../controllers/authUserController");

router.post("/registrar", authUserController.register);
router.post("/login", authUserController.login);
router.post('/forgotPassword', authUserController.forgotPassword);

module.exports = router;
