const express = require("express");
const router = express.Router();
const authController = require("../controllers/authBusinessController");
const BusinessController = require('../controllers/businessController')

router.get(
    '/me',
    authController.protect,
    BusinessController.getMeBusiness,
    BusinessController.getBusiness
);

router.patch('/update/:id', authController.protect, BusinessController.updateMeBusiness);

router
    .route('/')
    .post(BusinessController.createBusiness)
    .get(BusinessController.getAllBusiness)

module.exports = router; 