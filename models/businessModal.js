const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        category: {
            type: String,
        },
        address: {
            type: Array,
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

businessSchema.virtual('job', {
    ref: 'Jobs',
    foreignField: 'business',
    localField: '_id',
});

module.exports = mongoose.model("Business", businessSchema);

