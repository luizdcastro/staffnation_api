const Job = require('../models/jobModel');
const factoty = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');


exports.createJob = factoty.createOne(Job);
exports.getJob = factoty.getOne(Job);
exports.getAllJobs = factoty.getAll(Job)
exports.updateJob = factoty.updateOne(Job);
exports.deleteJob = factoty.deleteOne(Job);

exports.createPendingApplication = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $addToSet: { pendingApplications: req.body.pendingApplications },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});

exports.removePendingApplication = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $pull: { pendingApplications: { $in: req.body.pendingApplications } },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});