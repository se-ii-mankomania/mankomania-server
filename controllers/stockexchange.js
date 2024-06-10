const { validationResult } = require("express-validator");
const Session = require('../models/session');
const Lobby = require('../models/lobby');
const StockExchange=require('../models/stockexchange');

exports.getStockChanges = async (req, res, next) => {
    const lobbyId = req.params.lobbyid;
        try {
            const stockChange= await getRandomStockExchange();

            console.log("Got random StockExchange:", stockChange);

            const sessions = await Session.getAllUsersByLobbyID(lobbyId);

            console.log("GetAllUsersByLobbyID successful",sessions);

            for (const session of sessions) {
                        console.log("in session loop");
                        const newBalance = await getNewBalanceByShareType(stockChange, session);
                        console.log("new Balance:",newBalance);
                        await StockExchange.updateBalance(session.userid,lobbyId, newBalance);
                        console.log("Updated Balance");
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

    async function getNewBalanceByShareType(shareType, session) {
        switch (shareType) {
            case 'basc':
                return calcBalanceAfterAscending(await StockExchange.getAmountBShares(session), session.balance);
            case 'bdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountBShares(session), session.balance);
            case 'tasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountTShares(session), session.balance);
            case 'tdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountTShares(session), session.balance);
            case 'kasc':
                return calcBalanceAfterAscending(await StockExchange.getAmountKvShares(session), session.balance);
            case 'kdesc':
                return calcBalanceAfterDescending(await StockExchange.getAmountKvShares(session), session.balance);
            case 'sonderzeichen':
                return calcBalanceAfterSonderzeichen(session, session.balance);
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

    async function calcBalanceAfterSonderzeichen(session, currentBalance) {
        const amountShares = await StockExchange.getAmountKvShares(session) + await StockExchange.getAmountTShares(session) + await StockExchange.getAmountBShares(session);
        return currentBalance + (amountShares * 10000);
    }

    async function getRandomStockExchange(){
        const outcomes=['basc','bdesc','tasc','tdesc','kasc','kdesc','sonderzeichen'];
        const randomIndex = Math.floor(Math.random() * outcomes.length);
        return outcomes[randomIndex];
    }