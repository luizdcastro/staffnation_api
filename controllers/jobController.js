const Job = require('../models/jobModel');
const factoty = require('./../controllers/handlerFactory');

exports.createJob = factoty.createOne(Job);
exports.getJob = factoty.getOne(Job);
exports.getAllJobs = factoty.getAll(Job)
exports.updateJob = factoty.updateOne(Job);
exports.deleteJob = factoty.deleteOne(Job);