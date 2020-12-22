const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControler");
const authUserController = require("../controllers/authUserController");

router.get(
    '/me',
    authUserController.protect,
    userController.getMe,
    userController.getUser
);

router.post(
    '/payment',
    userController.createToken
);

router
    .route('/')
    .get(userController.getAllusers)

router.patch('/update/:id', authUserController.protect, userController.updateMe);

module.exports = router;