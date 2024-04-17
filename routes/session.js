const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const Session = require('../models/session');

const sessionController = require('../controllers/session');

router.get('/getAll', sessionController.getAllByUserID);

router.get('/lobby/:lobbyid', sessionController.getAllUsersByLobbyID);

router.post('/initialize',
body('lobbyid').isUUID(),
sessionController.initializeSession);

router.post('/setColor/:lobbyid',
body('color').isIn(['red', 'blue', 'green', 'yellow']),
sessionController.setColor);
module.exports = router;