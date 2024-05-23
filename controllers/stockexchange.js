const { validationResult } = require("express-validator");
const Session = require('../models/session');
const Lobby = require('../models/lobby');
const StockExchange=require('../models/stockexchange');

exports.getStockChanges = async (req, res, next) => {
    const lobbyid = req.lobbyid;

}



const balance = await Session.getBalance(session);