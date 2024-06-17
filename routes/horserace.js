const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const horseRaceController = require('../controllers/horserace');

router.post('/startHorseRace/:lobbyid', horseRaceController.startHorseRace);

module.exports = router;
