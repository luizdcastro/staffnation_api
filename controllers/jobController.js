const Job = require('../models/jobModel');
const factoty = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');


exports.createJob = factoty.createOne(Job);
exports.getJob = factoty.getOne(Job);
exports.getAllJobs = factoty.getAll(Job)
exports.updateJob = factoty.updateOne(Job);
exports.deleteJob = factoty.deleteOne(Job);

exports.createAppPending = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $addToSet: { applicationsPending: req.body.applicationsPending },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});

exports.removeAppPending = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $pull: { applicationsPending: { $in: req.body.applicationsPending } },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});

exports.createAppAccepted = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $addToSet: { applicationsAccepted: req.body.applicationsAccepted },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});

exports.removeAppAccepted = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $pull: { applicationsAccepted: { $in: req.body.applicationsAccepted } },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});


exports.createAppFinished = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $addToSet: { applicationsFinished: req.body.applicationsFinished },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});

exports.removeAppFinished = catchAsync(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, {
        $pull: { applicationsFinished: { $in: req.body.applicationsFinished } },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});