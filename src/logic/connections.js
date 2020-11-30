const Rooms = require('../models/rooms');
const GameState = require('../models/game-state');
const ConnectionHandler = require('./connection-handler');
const CurrentPlayersSender = require('./current-players-sender');

class Connections {
    constructor() {
        this.rooms = new Rooms();
        this.connectionHandlers = [];
        this.currentPlayersSender = new CurrentPlayersSender();
        this.getRooms = this.getRooms.bind(this);
        this.startSendingCurrentPlayers = this.startSendingCurrentPlayers.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }

    getRooms() {
        return this.rooms.getRooms();
    }

    startSendingCurrentPlayers(io) {
        this.currentPlayersSender.startSending(io);
    }

    createRoom(io) {
        const gameState = new GameState();
        const room = this.rooms.addRoom(gameState);
        const connectionHandler = new ConnectionHandler();
        this.connectionHandlers.push(connectionHandler)
        connectionHandler.initialize(io, room);
        this.currentPlayersSender.addHandler(connectionHandler);
    }

    connectMobile(mobileCode) {
        const result = {};

        this.connectionHandlers.forEach(handler => {
            const player = handler.players.find(player => player.mobileCode = mobileCode);

            if (player) {
                result.roomName = handler.room.name;
                result.playerId = player.id;
            }
        });

        return result;
    }
}

module.exports = Connections;
