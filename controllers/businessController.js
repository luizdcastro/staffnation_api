const Business = require('../models/businessModal');
const factoty = require('./handlerFactory');

exports.createBusiness = factoty.createOne(Business);
exports.getBusiness = factoty.getOne(Business);
exports.getAllBusiness = factoty.getAll(Business)
exports.upddateBusiness = factoty.updateOne(Business);
exports.deleteBusiness = factoty.deleteOne(Business);