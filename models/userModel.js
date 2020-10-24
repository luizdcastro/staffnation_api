const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	cpf: {
		type: String,
		required: [true, "Por favor, informe seu CPF"],
	},
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
	password: {
		type: String,
		required: [true, "Por favor, informe sua senha"],
		select: false,
		minlength: 6,
	},
	address: {
		type: Object,
	},
	image: {
		type: String,
	},
	rating: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre("save", async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;

	next();
});

module.exports = mongoose.model("Users", userSchema);
