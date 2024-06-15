const { validationResult } = require("express-validator");
const Session = require('../models/session');

exports.boese1 = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        const response = {
        message: 'Something went wrong.',
        };
        res.status(400).json(response);
        return;
        }
    const session = {
        userid: req.userId,
        lobbyid: req.params.lobbyid
    }

    const balance = await Session.getBalance(session);

    let newBalance;

    try {
        switch (req.body.one) {
            case 0:
                newBalance = balance - (req.body.sum * 5000);
                await Session.updateBalance(session, newBalance);
                res.status(200).end();
                break;
            case 1:
                newBalance = balance + (100000);
                await Session.updateBalance(session, newBalance)
                res.status(200).end();
                break;
            case 2:
                newBalance = balance + 300000;
                await Session.updateBalance(session, newBalance)
                res.status(200).end();
                break;
            default:
                throw new Error('Invalid number');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}