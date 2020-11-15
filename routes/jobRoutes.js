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
    .patch(JobController.createPendingApplication)

router
    .route('/removePending/:id')
    .patch(JobController.removePendingApplication)

module.exports = router;