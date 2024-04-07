const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const Lobby = require('../models/lobby');

const lobbyController = require('../controllers/lobby');

router.get('/getAll', lobbyController.getAll);

router.get('/getByStatus/:status', lobbyController.getByStatus);

router.post(
  '/create',
  [
    body('name').trim().isLength({ min: 3 }),
    body('password'), 
    body('isPrivate').isBoolean(),
    body('maxPlayers').isInt(),
    body('status').isIn(['open', 'starting', 'inGame', 'finished', 'closed']),
  ],
  lobbyController.create
);

module.exports = router;