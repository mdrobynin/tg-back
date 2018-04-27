const config = require('../config/config');
const Helpers = require('../utils/helpers');

class BulletState {
    constructor(player) {
        this.player = player;
        this.coordinates = player.coordinates;
        this.direction = player.direction;
    }

    move() {
        const nextPosition = {
            x: this.coordinates.x + this.direction.x * config.bullet.speed,
            y: this.coordinates.y + this.direction.y * config.bullet.speed
        };
        const isInScreen = Helpers.checkBoundariesForBullet(nextPosition);
        if (isInScreen) {
            this.coordinates = nextPosition;
        }
        return isInScreen;
    }
}

module.exports = BulletState;
