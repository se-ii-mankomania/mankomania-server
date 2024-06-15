const { validationResult } = require("express-validator");
const crypto = require('crypto');
const Session = require('../models/session');
const Lobby = require('../models/lobby');
const StockExchange = require('../models/stockexchange');

exports.startStockExchange = async (req, res, next) => {
    try {
        const lobbyId = req.params.lobbyid;
        await StockExchange.startStockExchangeMinigame(lobbyId);
        res.status(200).json({ message: 'Stock Exchange started!' });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);}
}

exports.endStockExchange = async (req, res, next) => {
    try {
        const lobbyId = req.params.lobbyid;
        await StockExchange.endStockExchangeMinigame(lobbyId);
        res.status(200).json({ message: 'Stock Exchange ended!' });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);}

}

exports.getStockChanges = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
        try {
            const stockChange= await getRandomStockExchange();
            const sessions = await Session.getAllUsersByLobbyID(lobbyId);
            for (const session of sessions) {
                        const newBalance = await getNewBalanceByShareType(stockChange, session,lobbyId);
                        await StockExchange.updateBalance(session.userid,lobbyId, newBalance);
            }

            res.status(200).json({stockChange});

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(500).json({ message: 'Something went wrong.' });
            next(err);
        }

}

exports.getStockTrend = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
        try {
            const stocktrend= await StockExchange.getCurrentStockTrend(lobbyId);

            res.status(200).json({stocktrend});

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(500).json({ message: 'Something went wrong.' });
            next(err);
        }

}

exports.setStockTrend = async (req, res, next) => {
    const errors  = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Something went wrong.' });
    }

    const lobbyid = req.params.lobbyid;
    const currentStockTrend=req.body.stocktrend;

    try {
        await StockExchange.updateCurrentStockTrend(lobbyid,currentStockTrend);
        res.status(200).json({ message: 'StockTrend set!' });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(500).json({ message: 'Something went wrong.' });
        next(err);
    }
};

    async function getNewBalanceByShareType(shareType, session, lobbyid) {
        switch (shareType) {
            case 'basc':
                return calcBalanceAfterAscending(await StockExchange.getAmountBShares(session,lobbyid), session.balance);
            case 'bdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountBShares(session,lobbyid), session.balance);
            case 'tasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountTShares(session, lobbyid), session.balance);
            case 'tdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountTShares(session,lobbyid), session.balance);
            case 'kasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountKvShares(session, lobbyid), session.balance);
            case 'kdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountKvShares(session, lobbyid), session.balance);
            case 'sonderzeichen':
                return calcBalanceAfterSonderzeichen(session,lobbyid, session.balance);
            default:
                throw new Error('Unknown share type');
        }
    }

    async function calcBalanceAfterAscending(amountShares, currentBalance) {
        return currentBalance + (amountShares * 10000);
    }

    async function calcBalanceAfterDescending(amountShares, currentBalance) {
        return currentBalance - (amountShares * 10000);
    }

    async function calcBalanceAfterSonderzeichen(session, lobbyid, currentBalance) {
        const amountShares = await StockExchange.getAmountKvShares(session,lobbyid) + await StockExchange.getAmountTShares(session,lobbyid) + await StockExchange.getAmountBShares(session,lobbyid);
        return currentBalance + (amountShares * 10000);
    }

    async function getRandomStockExchange(){
        const outcomes=['basc','bdesc','tasc','tdesc','kasc','kdesc','sonderzeichen'];
         const randomIndex = crypto.randomInt(0, outcomes.length);
        return outcomes[randomIndex];
    }

