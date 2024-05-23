const express = require('express');

const router = express.Router();

const StockExchange = require('../models/stockexchange');

const stockexchangeController = require('../controllers/stockexchange');

router.get('/getStockChanges/:lobbyid', stockexchangeController.getStockChanges);

module.exports = router;