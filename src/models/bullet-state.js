const { BULLET_SPEED } = require('../config/config');

class BulletState {
    constructor(player) {
        this.player = player;
        this.coordinates = player.coordinates;
        this.direction = player.direction;
    }

    move() {
        const { x, y } = this.coordinates;

        this.coordinates = {
            x: x + this.direction.x * BULLET_SPEED,
            y: y + this.direction.y * BULLET_SPEED
        };
    }
}

module.exports = BulletState;
