const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const Stockexchange = require('../models/stockexchange');

const stockexchangeController = require('../controllers/stockexchange');

router.get('/getStockChanges/:lobbyid', stockexchangeController.getStockChanges);

router.post('/setStockTrend/:lobbyid',
    body('stocktrend').isIn(['basc', 'bdesc', 'tasc', 'tdesc', 'kasc', 'kdesc', 'sonderzeichen']),
    stockexchangeController.setStockTrend
);

router.get('/getStockTrendByLobbyID/:lobbyid', stockexchangeController.getStockTrend);

router.get('/startStockExchange/:lobbyid', stockexchangeController.startStockExchange);

router.get('/stopStockExchange/:lobbyid', stockexchangeController.endStockExchange);

module.exports = router;