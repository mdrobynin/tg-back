const express = require('express');
const router = express.Router();
const Rooms = require('./models/rooms');
const GameState = require('./models/game-state');
const rooms = new Rooms();
const StateHandler = require('./logic/state-handler');

router.route('/')
    .get((req, res) => {
        res.send(JSON.stringify(rooms.getRooms()));
    })
    .post((req, res) => {
        createRoom(req.io);
        res.send('ok');
    });

function createRoom(io) {
    const gameState = new GameState();
    const room = rooms.addRoom(gameState);
    const stateHandler = new StateHandler();
    stateHandler.initialize(io, room);
}

module.exports = router;
