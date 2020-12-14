const Business = require("../models/businessModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/email');

function generateToken(params = {}) {
    return jwt.sign(params, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}


const createSendToken = (business, statusCode, res) => {
    const token = signToken(business._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    business.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            business: business,
        },
    });
};

exports.register = async (req, res) => {
    const { name, phone, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.status(400).send({ error: "Confirmação de senha inválida" });
    }

    if (password.length < 6) {
        return res.status(400).send({ error: "Senha deve conter no mínimo de 6 digitos" });
    }

    const businessEmail = await Business.findOne({ email: req.body.email });
    if (businessEmail) {
        return res.status(400).send({ error: `Email ${email} já cadastrado` });
    }

    let business;
    business = await Business.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    business.password = undefined;

    res.status(201).json({
        status: "success",
        data: business,
        token: generateToken({ id: business.id }),
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: "Informe seu email e senha" });
    }

    const business = await Business.findOne({ email }).select("+password");

    if (!business || !(await bcrypt.compare(password, business.password))) {
        return res.status(401).send({ error: "Seu email ou senha estão incorretos" });
    }

    business.password = undefined;

    res.status(200).json({
        status: "success",
        data: business,
        token: generateToken({ id: business.id }),
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
        req.business = decoded.id;
    });

    next();
};

exports.forgotPassword = async (req, res, next) => {
    const business = await Business.findOne({ email: req.body.email });

    if (!business) {
        return res.status(401).send({ error: "Nenhum email localizado para seu email" });
    }

    const resetToken = business.createPasswordResetToken();
    await business.save({ validateBeforeSave: false });

    const resetURL = `https://staffnation.com.br/${resetToken}`;

    const message = `Olá, ${business.name}. Clique no link abaixo para alterar sua senha. ${resetURL}.\nCaso você não tenha pedido essa alteração, entre em contato com a gente.`;

    try {
        await sendEmail({
            email: business.email,
            subject: 'Link para alteração de senha do Staffnation',
            message,
        });

        res.status(200).json({
            status: 'success',
            message,
        });
    } catch (error) {
        console.log(error)
        business.passwordResetToken = undefined;
        business.passwordResetExpires = undefined;
        await business.save({ validateBeforeSave: false });

        return next(
            res.status(400).send({ error: "Ocorreu um erro durante o envio do e-mail! Tente novamente." })
        );
    }
};
