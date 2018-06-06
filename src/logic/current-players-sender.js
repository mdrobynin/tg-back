const { SOCKET_CURRENT_ONLINE_PLAYERS_ACTION } = require('../config/constants');

class CurrentPlayersSender {
    constructor() {
        this.handlers = [];
        this.intervalIsSet = false;
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    startSending(io) {
        if (!this.intervalIsSet) {
            setInterval(() => {
                const playersPerRoom = this.handlers
                    .map(handler => {
                        return {
                            room: handler.room.name,
                            players: handler.players.length
                        };
                    });
                io.emit(SOCKET_CURRENT_ONLINE_PLAYERS_ACTION, JSON.stringify(playersPerRoom));
            }, 500);
            this.intervalIsSet = true;
        }
    }
}

module.exports = CurrentPlayersSender;
