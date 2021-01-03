const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const businessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Por favor, informe seu nome"],
        },
        email: {
            type: String,
            required: [true, "Por favor, informe seu email"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Por favor, informe seu telefone"],
        },
        favorites:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                }
            ],
        password: {
            type: String,
            required: [true, "Por favor, informe sua senha"],
            select: false,
            minlength: 6,
        },
        confirmPassword: {
            type: String,
            required: [true, "Por favor, informe sua senha"],
            select: false,
            minlength: 6,
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

businessSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'favorites',
        select: 'name avatar phone address rating'
    })
    next()
})

businessSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

businessSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
});

businessSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimesStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimesStamp;
    }
    return false;
};

businessSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("Business", businessSchema);

