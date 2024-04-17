const { validationResult } = require("express-validator");
const Session = require('../models/session');

exports.getAllByUserID = async (req, res, next) => {
    const userId = req.userId;
    try {
        const sessions = await Session.getAllByUserID(userId);
        res.status(200).json(sessions);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
};

exports.getAllUsersByLobbyID = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
    try {
        const users = await Session.getAllUsersByLobbyID(lobbyId);
        res.status(200).json(users);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
};

exports.initializeSession = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const response = {
            message: 'Something went wrong.',
        };
        res.status(400).json(response);
        return;
    }

    const maxPlayers = await Session.getMaxAmountOfUsersByLobbyID(req.body.lobbyid);

    const playersInLobby = await Session.countUsersByLobbyID(req.body.lobbyid);

    if (parseInt(playersInLobby) >= maxPlayers) {
        const response = {
            message: 'Lobby is full.',
        };
        res.status(400).json(response);
        return;
    }

    let playersTurn = false; 

    if(playersInLobby == 0){
        playersTurn = true;
    }


    const user = req.userId;
    const session = {
        userid: user,
        lobbyid: req.body.lobbyid,
        isplayersturn: playersTurn
    };

    try {
        const result = await Session.initializeSession(session);

        res.status(201).json({ message: 'Session initialized!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}

exports.setColor = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const response = {
            message: 'Something went wrong.',
        };
        res.status(400).json(response);
        return;
    }

    const user = req.userId;
    const session = {
        color: req.body.color,
        userid: user,
        lobbyid: req.params.lobbyid
    };

    try {
        const result = await Session.setColor(session);

        res.status(201).json({ message: 'Color set!' });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}