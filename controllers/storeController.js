const Store = require('../models/storeModel');
const factoty = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.createStore = factoty.createOne(Store);
exports.getAllStore = factoty.getAll(Store)
exports.deleteStore = factoty.deleteOne(Store);

exports.getStore = catchAsync(async (req, res, next) => {
    const store = await Store.findById(req.params.id)
        .populate({
            path: 'jobs',

        })

    res.status(200).json({
        status: 'success',
        data: store,
    });
})

exports.updateStore = catchAsync(async (req, res, next) => {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: store,
    });
});