const { validationResult } = require("express-validator");
const Session = require('../models/session');

exports.startHorseRace = async (req, res, next) => {

const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const betValue = parseInt(req.body.betValue)
    const pickedHorse = parseInt(req.body.pickedHorse)
    const user = req.body.userId;

    let horsePlaces = [1, 2, 3, 4]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    const session = {
        userid: user,
        lobbyid: req.params.lobbyid
    };
    let i
    for (i = 0; i < horsePlaces.length; i++) {
        if(pickedHorse == horsePlaces[i])
            break
    }
    let multiplier
    switch(i) {
        case 0: multiplier = 3; break;
        case 1: multiplier = 2; break;
        case 2: multiplier = 0; break;
        case 3: multiplier = -1; break;
    }
    const balance = await Session.getBalance(session);
    const newBalance = parseInt(balance + (betValue * multiplier))
        try {
            await Session.updateBalance(session, newBalance);
            res.status(200).json({ horsePlaces: horsePlaces });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(500).json({ message: 'Something went wrong.' });
            next(err);
        }
}