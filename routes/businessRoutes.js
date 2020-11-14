const express = require("express");
const router = express.Router();
const BusinessController = require('../controllers/businessController')

router
    .route('/')
    .post(BusinessController.createBusiness)
    .get(BusinessController.getAllBusiness)

router
    .route('/:id')
    .get(BusinessController.getBusiness)
    .patch(BusinessController.upddateBusiness)
    .delete(BusinessController.deleteBusiness)

module.exports = router; 