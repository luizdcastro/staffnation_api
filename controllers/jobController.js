const Job = require('../models/jobModel');
const User = require('../models/userModel')
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

const ratingGenerator = async (user) => {
    const userJobs = await Job.find({
        "applicationsFinished.userId": user,
        "applicationsFinished.isRated": true
    });

    const filterRated = userJobs
        .map(job => job.applicationsFinished
            .find(el => el.userId == user && el.isRated == true)
        );

    const calculation = filterRated.map(el => el.score).reduce((a, b) => a + b, 0) / filterRated.map(el => el.score).length

    await User.findByIdAndUpdate(user, { rating: calculation }, {
        new: true,
        runValidators: true,
    });
}

exports.createAppFinished = catchAsync(async (req, res, next) => {
    const jobId = await Job.findById(req.params.id)

    if (jobId.applicationsFinished.some(el => el.userId == req.body.applicationsFinished.userId)) {
        const job = await Job.findOneAndUpdate(
            {
                "_id": req.params.id,
                "applicationsFinished.userId": req.body.applicationsFinished.userId
            },
            {
                "$set": {
                    "applicationsFinished.$.score": req.body.applicationsFinished.score,
                    "applicationsFinished.$.isRated": req.body.applicationsFinished.isRated
                },
            }
        )
        ratingGenerator(req.body.applicationsFinished.userId);

        res.status(200).json({
            status: 'success',
            data: job
        });

    } else {
        const job = await Job.findByIdAndUpdate(req.params.id, {
            $addToSet: {
                "applicationsFinished": {
                    userId: req.body.applicationsFinished.userId,
                    isRated: req.body.applicationsFinished.isRated,
                    score: req.body.applicationsFinished.score
                }
            },
            new: true,
        });

        ratingGenerator(req.body.applicationsFinished.userId);

        res.status(200).json({
            status: 'success',
            data: job
        });
    }
})


exports.removeAppFinished = catchAsync(async (req, res, next) => {
    const remove = await Job.findByIdAndUpdate(req.params.id, {
        $pull: {
            "applicationsFinished": {
                userId: { $in: req.body.applicationsFinished.userId },
            }
        },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: job
    });
});