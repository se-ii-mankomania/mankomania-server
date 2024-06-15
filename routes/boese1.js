const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const boese1Controller = require('../controllers/boese1');

router.post('/boese1/:lobbyid',
body('sum').isInt(), 
body('one').isInt().isIn([0, 1,2]),
boese1Controller.boese1);

module.exports = router;