const User = require('../models/userModel');
const factoty = require('./../controllers/handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const fetch = require('node-fetch');
const dotenv = require("dotenv");
const { JunoCardHash } = require('juno-nodejs');

exports.getAllusers = factoty.getAll(User);
exports.updateUser = factoty.updateOne(User);
exports.deleteUser = factoty.deleteOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.userId;
    next();
};

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .populate('jobsPending')
        .populate('jobsAccepted')
        .populate('jobsFinished')
    res.status(200).json({
        status: 'success',
        data: user,
    });
})

exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: user,
    });
});

exports.createToken = async (req, res, next) => {
    const user = await User.findOne({ _id: req.body.id });

    if (!user) {
        return res.status(400).send({ error: "Ocorreu um erro, tente novamente." });
    }

    const { holderName, cardNumber, securityCode, expirationMonth, expirationYear } = req.body

    const publicToken = process.env.JUNO_PUBLIC_TOKEN;
    const environment = 'sandbox';

    const cardData = {
        holderName,
        cardNumber,
        securityCode,
        expirationMonth,
        expirationYear,
    };

    const junoService = new JunoCardHash(publicToken, environment);

    try {
        const hash = await junoService.getCardHash(cardData)

        const data = {
            creditCardHash: hash
        }

        const bearer = process.env.JUNO_BEARER_TOKEN
        const resourseToken = process.env.JUNO_RESOURCE_TOKEN,

        const token = await fetch(process.env.JUNO_API, {
            method: 'POST',
            headers: {
                'X-Api-Version': '2',
                'X-Resource-Token': resourseToken,
                'Content-Type': 'application/json',
                'Authorization': bearer
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                const creditCard = {
                    creditCard: {
                        creditCardId: data.creditCardId,
                        last4CardNumber: data.last4CardNumber,
                        expirationMonth: data.expirationMonth,
                        expirationYear: data.expirationYear
                    }
                }
                User.findByIdAndUpdate(user._id, creditCard, {
                    new: true,
                    runValidators: true,
                }).then(console.log(user._id, creditCard))
            })
            .catch((error) => {
                console.error(error);
            });

        res.status(200).json({
            status: 'success',
            token
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'fail',
            error: 'Cartão inválido, tente novamente.'
        });
    }
};
