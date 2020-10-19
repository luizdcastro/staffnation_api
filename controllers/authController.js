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
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: req.body.password,
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
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).send({ error: "Informe seu email e senha" });
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send({ error: "Seu email ou senha estão incorretos" });
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
