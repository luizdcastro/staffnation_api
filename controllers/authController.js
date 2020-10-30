const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(params = {}) {
	return jwt.sign(params, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
}

exports.register = async (req, res) => {
	let user;
	try {
		user = await User.create({
			cpf: req.body.cpf,
			name: req.body.name,
			birthdayDate: req.body.birthdayDate,
			address: req.body.address,
			email: req.body.email,
			phone: req.body.phone,
			categories: req.body.categories,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
		});
		user.password = undefined;
	} catch (error) {
		res.status(400).json({ status: "fail", error: error });
	}

	res.status(201).json({
		status: "success",
		data: user,
		token: generateToken({ id: user.id }),
	});
};

exports.login = async (req, res, next) => {
	const { cpf, password } = req.body;
	if (!cpf || !password) {
		return res.status(400).send({ error: "Informe seu cpf e senha" });
	}

	const user = await User.findOne({ cpf }).select("+password");

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send({ error: "Seu cpf ou senha estão incorretos" });
	}

	user.password = undefined;

	res.status(200).json({
		status: "success",
		data: user,
		token: generateToken({ id: user.id }),
	});
};

exports.protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) return res.status(401).send({ error: "Token não informado" });

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(401).send({ error: "Token inválido" });
		req.userId = decoded.id;
	});

	next();
};
