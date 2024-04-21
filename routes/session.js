const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const Session = require('../models/session');

const sessionController = require('../controllers/session');

router.get('/getAll', sessionController.getAllByUserID);

router.get('/status/:lobbyid', sessionController.getAllUsersByLobbyID);

router.get('/unavailableColors/:lobbyid', sessionController.getUnavailableColors);

router.post('/initialize',
body('lobbyid').isUUID(),
sessionController.initializeSession);

router.post('/setColor/:lobbyid',
body('color').isIn(['red', 'blue', 'green', 'lila']),
sessionController.setColor);
module.exports = router;