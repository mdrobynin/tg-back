const MainLoop = require('./main-loop');
const {
    SOCKET_GET_CONNECTION_ID_ACTION_NAME,
    SOCKET_JOIN_ROOM_ACTION_NAME,
    SOCKET_GET_MOBILE_CODE_ACTION_NAME,
    SOCKET_MOBILE_JOIN_ROOM_ACTION_NAME,
    SOCKET_MOBILE_LEAVE_ROOM_ACTION_NAME,
    SOCKET_LEAVE_ROOM_ACTION_NAME
} = require('../config/constants');
const PlayerState = require('../models/player-state');
const UserEventsObservable = require('./user-events-observable');
const Controller = require('../controllers/controller');
const nextMobileCode = require('./mobile-code-generator');

class ConnectionHandler {
    constructor () {
        this.connections = [];
    }

    initialize(io, room) {
        this.room = room;
        this.observables = [];
        this.players = [];
        this.controller = new Controller(this.room.gameState);
        this.mainLoop = new MainLoop(room.gameState, io, room.name);
        this.gameState = room.gameState;

        this.mainLoop.addCallback(this.controller.handleMainTick.bind(this.controller));
        this._addMainCallbacks(room.gameState);
        this._addSocketEventHandlers(io, room);
    }

    _addSocketEventHandlers(io, room) {
        io.on('connection', (socket) => {
            const mobileCode = nextMobileCode();

            socket.emit(SOCKET_GET_CONNECTION_ID_ACTION_NAME, socket.id);
            socket.emit(SOCKET_GET_MOBILE_CODE_ACTION_NAME, mobileCode);
            socket.on(SOCKET_JOIN_ROOM_ACTION_NAME, roomName => {
                if (room.name === roomName) {
                    this._joinRoomHandler(socket, roomName, mobileCode);
                }
            });
            socket.on(SOCKET_LEAVE_ROOM_ACTION_NAME, roomName => {
                if (room.name === roomName) {
                    this._leaveRoomHandler(socket, roomName);
                }
            });

            socket.on(SOCKET_MOBILE_JOIN_ROOM_ACTION_NAME, msg => {
                const data = JSON.parse(msg);

                if (room.name === data.roomName) {
                    this._mobileJoinRoomHandler(socket, data);
                }
            });

            socket.on(SOCKET_MOBILE_LEAVE_ROOM_ACTION_NAME, msg => {
                const data = JSON.parse(msg);

                if (room.name === data.roomName) {
                    this._mobileLeaveRoomHandler(socket, data);
                }
            });
        });
    }

    _joinRoomHandler(socket, roomName, mobileCode) {
        socket.join(roomName, () => {
            this.players = this.players.filter(c => c.id === socket.id);
            this.observables = this.observables.filter(c => c.id !== socket.id);

            const coordinates = this.gameState.getRandomGrassTerrainCoordinates();
            const player = new PlayerState(coordinates, socket.id, mobileCode);
            const observable = new UserEventsObservable(socket);

            this.observables.push(observable);
            this.players.push(player);
            this.controller.addPlayer(player, observable);
        });
    }

    _leaveRoomHandler(socket, roomName) {
        socket.leave(roomName, () => {
            this.observables = this.observables.filter(c => c.id !== socket.id);
            const player = this.players.find(c => c.id === socket.id);

            if (player) {
                this.controller.removePlayer(player);
            }
            this.players = this.players.filter(c => c.id === socket.id);
        });
    }

    _mobileJoinRoomHandler(socket, data) {
        const { roomName, playerId } = data;

        socket.join(roomName, () => {
            const observable = new UserEventsObservable(socket);

            this.observables.push(observable);
            this.controller.addSourceToPlayer(playerId, observable);
        });
    }

    _mobileLeaveRoomHandler(socket, data) {
        const { roomName } = data;

        socket.leave(roomName, () => {
            this.observables = this.observables.filter(c => c.id !== socket.id);
        });
    }

    _addMainCallbacks() {
        this.mainLoop.addCallback(this.gameState.handleBulletsMovement.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeOutOfScreenBullets.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.checkBulletsHitting.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeDeadPlayers.bind(this.gameState));
        this.mainLoop.addCallback(this.gameState.removeBrokenWalls.bind(this.gameState));
    }
}

module.exports = ConnectionHandler;
