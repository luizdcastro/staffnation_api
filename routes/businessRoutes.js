const express = require("express");
const router = express.Router();
const authBusinessController = require("../controllers/authBusinessController");
const BusinessController = require('../controllers/businessController')

router.get(
    '/me',
    authBusinessController.protect,
    BusinessController.getMeBusiness,
    BusinessController.getBusiness
);

router
    .route('/')
    .post(BusinessController.createBusiness)
    .get(BusinessController.getAllBusiness)

router.patch('/update/:id', authBusinessController.protect, BusinessController.updateMeBusiness);


router
    .route('/addFavorite/:id')
    .patch(BusinessController.addFavorite)

router
    .route('/deleteFavorite/:id')
    .patch(BusinessController.deleteFavorite)

module.exports = router; 