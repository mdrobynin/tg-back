class Rooms {
    constructor () {
        this.rooms = [];
        this.lastRoomNumber = 1;
    }

    addRoom(gameState) {
        const room = new Room(this.lastRoomNumber++, gameState);
        this.rooms.push(room);
        return room;
    }

    getRooms() {
        return this.rooms;
    }
}

class Room {
    constructor(number, gameState) {
        this.name = `Room ${number}`;
        this.gameState = gameState;
    }
}

module.exports = Rooms;
