const mongoose = require("mongoose");
const Business = require('./businessModal');


const jobSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.ObjectId,
            ref: 'Business',
        },
        applicationsPending:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                }
            ],
        applicationsAccepted:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                }
            ],
        applicationsFinished:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                }
            ],
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

