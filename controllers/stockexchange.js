const { validationResult } = require("express-validator");
const Session = require('../models/session');
const Lobby = require('../models/lobby');
const StockExchange=require('../models/stockexchange');

exports.getStockChanges = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
        try {
            const outcomes=['basc','bdesc','tasc','tdesc','kasc','kdesc','sonderzeichen'];
            const randomIndex = Math.floor(Math.random() * outcomes.length);
            const stockChange=outcomes[randomIndex];

            const sessions = await Session.getAllUsersByLobbyID(lobbyId);

            for (const session of sessions) {
                        const userId = session.userid;
                        const currentBalance = session.balance;
                        const newBalance = await getNewBalanceByShareType(stockChange, userId, currentBalance);
                        await Session.updateBalance(userId, newBalance);
            }

            res.status(200).json(stockChange);

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            res.status(500).json({ message: 'Something went wrong.' });
            next(err);
        }

}

    async function getNewBalanceByShareType(shareType, userId, currentBalance) {
        switch (shareType) {
            case 'basc':
                return calcBalanceAfterAscending(await StockExchange.getAmountBShares(userId), currentBalance);
            case 'bdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountBShares(userId), currentBalance);
            case 'tasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountTShares(userId), currentBalance);
            case 'tdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountTShares(userId), currentBalance);
            case 'kasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountKvShares(userId), currentBalance);
            case 'kdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountKvShares(userId), currentBalance);
            case 'sonderzeichen':
                return calcBalanceAfterSonderzeichen(userId, currentBalance);
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

    async function calcBalanceAfterSonderzeichen(userId, currentBalance) {
        const amountShares = await StockExchange.getAmountKvShares(userId) + await StockExchange.getAmountTShares(userId) + await StockExchange.getAmountBShares(userId);
        return currentBalance + (amountShares * 10000);
    }