const constants = require('./config/constants');
const express = require('express');
const router = express.Router();
const Rooms = require('./models/rooms');
const GameState = require('./models/game-state');
const rooms = new Rooms();
const ConnectionHandler = require('./logic/connection-handler');
const CurrentPlayersSender = require('./logic/current-players-sender');

const currentPlayersSender = new CurrentPlayersSender();

router.route('/')
    .get((req, res) => {
        res.send(JSON.stringify(rooms.getRooms()));
        currentPlayersSender.startSending(req.io);
    })
    .post((req, res) => {
        createRoom(req.io);
        res.send('ok');
    });

function createRoom(io) {
    const gameState = new GameState();
    const room = rooms.addRoom(gameState);
    const connectionHandler = new ConnectionHandler();
    connectionHandler.initialize(io, room);
    currentPlayersSender.addHandler(connectionHandler);
}

module.exports = router;
