const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
	{
		cpf: {
			type: String,
			required: [true, "Por favor, informe seu CPF"],
			unique: true,
		},
		name: {
			type: String,
			required: [true, "Por favor, informe seu nome"],
		},
		gender: {
			type: String,
			required: [true, "Por favor, informe seu nome"],
		},
		birthdayDate: {
			type: String,
			required: [true, "Por favor, informe sua data e nascimento"],
		},
		address: {
			type: Object,
			required: [true, "Por favor, informe seu endereço"],
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
		categories: {
			type: Array,
			required: [true, "Por favor, informe suas categorias"],
		},
		pushId: {
			type: String,
			default: 'ExponentPushToken'
		},
		creditCard: {
			type: Object,
		},
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
		avatar: {
			type: Object,
			default: {
				id: '',
				url: 'https://staffnation-images.s3.amazonaws.com/e1aa9211ba057dcd05f8ae6d8a15698c-default.png'
			}
		},
		rating: {
			type: Number,
			default: 0
		},
		bankData: {
			type: Object,
			default: {
				bankNumber: '',
				agencyNumber: '',
				accountNumber: '',
				accountComplementNumber: '',
				accountType: '',
				accountHolder: ''
			}
		},
		totalCash: {
			type: Number,
			default: 0
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual('jobsPending', {
	ref: 'Jobs',
	foreignField: 'applicationsPending',
	localField: '_id'
})

userSchema.virtual('jobsAccepted', {
	ref: 'Jobs',
	foreignField: 'applicationsAccepted',
	localField: '_id'
})

userSchema.virtual('jobsFinished', {
	ref: 'Jobs',
	foreignField: 'applicationsFinished',
	localField: '_id'
})

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	this.confirmPassword = undefined;
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimesStamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimesStamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("Users", userSchema);
