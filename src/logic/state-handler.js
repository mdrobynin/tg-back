const MainLoop = require('./main-loop');
const constants = require('../config/constants');
const Connection = require('../models/connection');

class StateHandler {
    constructor () {
        this.connections = [];
    }

    initialize(io, room) {
        this.mainLoop = new MainLoop(room.gameState, io, room.name);
        this.gameState = room.gameState;
        this._addMainCallbacks(room.gameState);
        this._addSocketEventHandlers(io, room);
    }

    _addSocketEventHandlers(io, room) {
        io.on('connection', (socket) => {
            socket.emit(constants.socketGetConnectionIdActionName, socket.id);
            socket.on(constants.socketJoinRoomActionName, roomName => {
                this._joinRoomHandler(socket, room, roomName);
            });
            socket.on(constants.socketReconnectAction, () => {
                this._reconnectHandler(socket);
            });
            socket.on(constants.socketLeaveRoomActionName, roomName => {
                this._leaveRoomHandler(socket, room, roomName);
            });
        });
    }

    _joinRoomHandler(socket, room, roomName) {
        if (room.name === roomName) {
            socket.join(roomName, () => {
                const connection = new Connection(socket, room);
                this.connections.push(connection);
                this.mainLoop.addCallback(connection.tickHandler);
            });
        }
    }

    _reconnectHandler(socket) {
        const connection = this.connections.find(c => c.id === socket.id);
        if (connection) {
            this.mainLoop.removeCallback(connection.tickHandler);
            connection.connect();
            this.mainLoop.addCallback(connection.tickHandler);
        }
    }

    _leaveRoomHandler(socket, room, roomName) {
        if (room.name === roomName) {
            socket.leave(roomName, () => {
                const connection = this.connections.find(c => c.id === socket.id);
                connection.abort();
                this.mainLoop.removeCallback(connection.tickHandler);
                this.connections.splice(this.connections.indexOf(connection), 1);
            });
        }
    }

    _addMainCallbacks() {
        this.mainLoop.addCallback(this.gameState.handleBulletsMovement.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeOutOfScreenBullets.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.checkBulletsHitting.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeDeadPlayers.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeBrokenWalls.bind(this.gameState));
    }
}

module.exports = StateHandler;
