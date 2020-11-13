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

module.exports = router;