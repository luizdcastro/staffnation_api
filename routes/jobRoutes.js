const express = require("express");
const router = express.Router();
const JobController = require('../controllers/jobController')

router
    .route('/')
    .post(JobController.createJob)
    .get(JobController.getAllJobs)

router
    .route('/:id')
    .get(JobController.getJob)
    .patch(JobController.updateJob)
    .delete(JobController.deleteJob)

router
    .route('/createPending/:id')
    .patch(JobController.createAppPending)

router
    .route('/removePending/:id')
    .patch(JobController.removeAppPending)

router
    .route('/createAccepted/:id')
    .patch(JobController.createAppAccepted)

router
    .route('/removeAccepted/:id')
    .patch(JobController.removeAppAccepted)

router
    .route('/createFinished/:id')
    .patch(JobController.createAppFinished)

router
    .route('/removeFinished/:id')
    .patch(JobController.removeAppFinished)

module.exports = router;