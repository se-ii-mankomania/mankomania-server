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
                        const userId = session.userId;
                        const currentBalance = session.balance;
                        const newBalance = await getNewBalanceByShareType(stockChange, userId, currentBalance);
                        await Session.updateBalance(userId, newBalance);
                    }

            res.status(200).json({ message: 'Stock changes applied successfully.', stockChange: stockChange });

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
                return calcBalanceAfterAscending(await getAmountBShares(userId), currentBalance);
            case 'bdesc':
                return calcBalanceAfterDescending(await getAmountBShares(userId), currentBalance);
            case 'tasc':
                return calcBalanceAfterAscending(await getAmountTShares(userId), currentBalance);
            case 'tdesc':
                return calcBalanceAfterDescending(await getAmountTShares(userId), currentBalance);
            case 'kasc':
                return calcBalanceAfterAscending(await getAmountKvShares(userId), currentBalance);
            case 'kdesc':
                return calcBalanceAfterDescending(await getAmountKvShares(userId), currentBalance);
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
        const amountShares = await getAmountKvShares(userId) + await getAmountTShares(userId) + await getAmountBShares(userId);
        return currentBalance + (amountShares * 10000);
    }