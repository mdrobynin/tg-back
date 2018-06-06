const {
    SOCKET_STATE_RECEIVE_ACTION_NAME
} = require('../config/constants');

class MainLoop {
    constructor(gameState, io, roomName) {
        this.roomName = roomName;
        this.io = io;
        this.gameState = gameState;
        this.callbacks = [];
        this._run();
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        this.callbacks = this.callbacks.filter(c => c !== callback);
    }

    _run() {
        setInterval(() => {
            const gameState = JSON.stringify(this.gameState);

            this.callbacks.forEach(c => c());
            this.io.to(this.roomName).emit(SOCKET_STATE_RECEIVE_ACTION_NAME, gameState);
        }, 1000 / 60);
    }
}

module.exports = MainLoop;
