const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControler");
const authController = require("../controllers/authController");

router.get(
    '/me',
    authController.protect,
    userController.getMe,
    userController.getUser
);

router.patch('/update/:id', authController.protect, userController.updateMe);



module.exports = router;