const { SOCKET_USER_ACTION_NAME } = require('../config/constants');

class UserEventsObservable {
    constructor(socket) {
        this.id = socket.id;
        this.observers = [];
        socket.on(SOCKET_USER_ACTION_NAME, this.fireEvent.bind(this));
    }

    fireEvent(event, thisObj) {
        const scope = thisObj || global;
        this.observers.forEach(observer => {
            observer.call(scope, event);
        });
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obsItem => obsItem !== observer);
    }
}

module.exports = UserEventsObservable;
