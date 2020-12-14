const mongoose = require("mongoose");
const Store = require('./storeModel');

const jobSchema = new mongoose.Schema(
    {
        businessAccount: {
            type: mongoose.Schema.ObjectId,
            ref: 'Business',
        },
        store: {
            type: mongoose.Schema.ObjectId,
            ref: 'Stores',
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
        description: {
            type: String,
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

jobSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'store',
        select: 'name phone image address'
    })
    next()
})

module.exports = mongoose.model("Jobs", jobSchema);

