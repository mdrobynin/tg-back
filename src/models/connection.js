const UserEventsObservable = require('../logic/user-events-observable');
const Controller = require('../controllers/controller');

class Connection {
    constructor (socket, room) {
        this.id = socket.id;
        this.socket = socket;
        this.room = room;
        this.connect();
    }

    connect() {
        if (this.controller) this.abort();
        this.observable = new UserEventsObservable(this.socket);
        this.controller = new Controller(this.observable, this.room.gameState, this.id);
        this.tickHandler = this.controller.handleMainTick.bind(this.controller);
    }

    abort() {
        this.controller.onDelete();
    }
}

module.exports = Connection;
