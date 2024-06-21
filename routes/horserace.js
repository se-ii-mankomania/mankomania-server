const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const horseRaceController = require('../controllers/horserace');



router.post(
    '/startHorseRace/:lobbyid',
    [
        body('betValue')
            .notEmpty()
            .withMessage('betValue is required')
            .isInt({ gt: 0 })
            .withMessage('betValue must be a positive integer'),
        body('pickedHorse')
            .notEmpty()
            .withMessage('pickedHorse is required')
            .isInt({ gt: 0 })
            .withMessage('pickedHorse must be a positive integer'),
        body('userId')
            .notEmpty()
            .withMessage('userId is required')
    ],
    horseRaceController.startHorseRace
);

module.exports = router;
