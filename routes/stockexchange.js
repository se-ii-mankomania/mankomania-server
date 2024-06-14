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

module.exports = router;