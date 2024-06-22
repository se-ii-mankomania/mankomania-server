const { validationResult } = require("express-validator");
const Session = require('../models/session');
const Lobby = require('../models/lobby');

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

    const alreadyJoined = await Session.alreadyJoined(req.userId, req.body.lobbyid);
    
    if(alreadyJoined.length > 0){
        const response = {
            message: 'Already joined.',
        };
        res.status(400).json(response);
        return;
    }
    let playersTurn = false; 

    if(playersInLobby == maxPlayers - 1){
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
        if(playersInLobby == maxPlayers - 1){
            const lobby = {
                id: req.body.lobbyid,
                status: 'inGame'
            };
            const result = await Lobby.setStatus(lobby);
        }else{
            const lobby = {
                id: req.body.lobbyid,
                status: 'starting'
            };
            const result = await Lobby.setStatus(lobby);
        }

        res.status(201).json({ message: 'Session initialized!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}

exports.setPosition = async (req, res, next) => {
    const errors  = validationResult(req);

    if (!errors.isEmpty()) {
        const response = {
            message: 'Something went wrong.',
        };
        res.status(400).json(response);
        return;
    }

    const user = req.userId;
    const session = {
        userid: user,
        currentposition: req.body.currentposition,
        lobbyid: req.params.lobbyid
    };

    let currentShares = [0, 0, 0];

    let sharesEffect = [0, 0, 0];

    let newShares = [0, 0, 0];

    const effect = await Session.getEffectOfField(session);

    for (let i = 0; i < 3; i++) {
        currentShares[i] = await Session.getCurrentShares(session, i);
        sharesEffect[i] = await Session.getSharesOfField(session, i);
        newShares[i] = currentShares[i] + sharesEffect[i];
        console.log(newShares[i]);
    }

    const balance = await Session.getBalance(session);

    const newBalance = balance + effect;

    try {
        const result = await Session.setPosition(session);
        await setNextPlayerTurn(session.lobbyid, user);
        await Session.updateBalance(session, newBalance);
        for (let i = 0; i < 3; i++) {
            await Session.updateShares(session, i, newShares[i]);
        }
        res.status(200).json({ message: 'Position set!' });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
};

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

exports.getUnavailableColors = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
    try {
        const colors = await Session.getUnavailableColors(lobbyId);
        
        if (colors !== null) {
            let setColors = [];
            colors.forEach(function(color) {
                if (color.color !== null) {
                    setColors.push(color);
                }
            });
            res.status(200).json(setColors);
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
}

async function setNextPlayerTurn(lobbyId, currentUserID) {
    try {
        const sessions = await Session.getAllUsersByLobbyID(lobbyId);

        const currentPlayerIndex = sessions.findIndex(session => session.isplayersturn);

        if(sessions[currentPlayerIndex].userid !== currentUserID){
            throw new Error('Current user is not the current player');
        }

        const nextPlayerIndex = (currentPlayerIndex + 1) % sessions.length;

        await Promise.all([
            Session.setIsPlayerTurn({ userid: currentUserID, lobbyid: lobbyId, isplayersturn: false }),
            Session.setIsPlayerTurn({ userid: sessions[nextPlayerIndex].userid, lobbyid: lobbyId, isplayersturn: true })
        ]);
    } catch (err) {
        console.error('Error setting next player turn:', err);
        throw err;
    }
}