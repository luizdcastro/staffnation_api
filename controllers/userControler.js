const User = require('../models/userModel');
const factoty = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.getAllusers = factoty.getAll(User);
exports.updateUser = factoty.updateOne(User);
exports.deleteUser = factoty.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        data: user,
    });
})

exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: user,
    });
});

