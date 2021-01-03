const Business = require('../models/businessModel');
const factoty = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.createBusiness = factoty.createOne(Business);
exports.getAllBusiness = factoty.getAll(Business)
exports.deleteBusiness = factoty.deleteOne(Business);

exports.getMeBusiness = (req, res, next) => {
    req.params.id = req.businessId;
    next();
};

exports.getBusiness = catchAsync(async (req, res, next) => {
    const business = await Business.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        data: business,
    });
})

exports.updateMeBusiness = catchAsync(async (req, res, next) => {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: business,
    });
});


exports.addFavorite = catchAsync(async (req, res, next) => {
    const business = await Business.findByIdAndUpdate(req.params.id, {
        $addToSet: { favorites: req.body.favorite },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: business
    });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
    const business = await Business.findByIdAndUpdate(req.params.id, {
        $pull: { favorites: { $in: req.body.favorite } },
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: business
    });
});