const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        category: {
            type: String,
        },
        positions: {
            type: Number
        },
        date: {
            type: String,
        },
        time: {
            type: Object,
        },
        payment: {
            type: Number,
        },
        uniform: {
            type: String,
        },
        address: {
            type: Object,

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

module.exports = mongoose.model("Jobs", jobSchema);

