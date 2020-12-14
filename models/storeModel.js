const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
    {
        businessAccount: {
            type: mongoose.Schema.ObjectId,
            ref: 'Business',
        },
        cnpj: {
            type: String,
        },
        name: {
            type: String,
        },
        category: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            type: Object
        },
        image: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

storeSchema.virtual('jobs', {
    ref: 'Jobs',
    foreignField: 'store',
    localField: '_id',
});

module.exports = mongoose.model("Stores", storeSchema);

