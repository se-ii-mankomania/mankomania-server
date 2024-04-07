const { validationResult } = require("express-validator");
const Lobby = require('../models/lobby');


exports.getAll = async (req, res, next) => {
    try {
        const lobbies = await Lobby.getAll();
        res.status(200).json(lobbies);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}



exports.getByStatus = async (req, res, next) => {
    const status = req.params.status;
    try {
        const lobbies = await Lobby.getByStatus(status);
        res.status(200).json(lobbies);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}

exports.create = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const response = {
            message: 'Something went wrong.',
        };
        console.log(errors.array());
        res.status(400).json(response);
        return;
    }

    const lobby = {
        name: req.body.name,
        password: req.body.password,
        isPrivate: req.body.isPrivate,
        maxPlayers: req.body.maxPlayers,
        status: req.body.status
    };

    try {
        const result = await Lobby.create(lobby);

        res.status(201).json({ message: 'Lobby created!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}