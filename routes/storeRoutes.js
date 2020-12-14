const express = require("express");
const router = express.Router();
const authController = require("../controllers/authBusinessController");
const StoreController = require("../controllers/storeController")

router.patch('/update/:id', authController.protect, StoreController.updateStore);
router.delete('/delete/:id', authController.protect, StoreController.deleteStore);

router
    .route('/:id')
    .get(StoreController.getStore)

router
    .route('/')
    .post(StoreController.createStore)
    .get(StoreController.getAllStore)

module.exports = router; 