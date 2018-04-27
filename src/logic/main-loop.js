const constants = require('../config/constants');

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
            this.callbacks.forEach(c => c());
            this.io.to(this.roomName)
                .emit(constants.socketStateReceiveActionName, JSON.stringify(this.gameState));
        }, 1000 / 60);
    }
}

module.exports = MainLoop;
