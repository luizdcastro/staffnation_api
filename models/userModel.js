const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
				bankName: '',
				agency: '',
				account: ''
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

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	this.confirmPassword = undefined;
});

module.exports = mongoose.model("Users", userSchema);
