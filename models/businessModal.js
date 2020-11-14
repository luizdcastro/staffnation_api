const mongoose = require("mongoose");

const bussinessSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Business", bussinessSchema);

