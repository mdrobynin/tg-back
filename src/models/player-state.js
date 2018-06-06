const { DIRECTIONS } = require('../config/constants');
const {
    CANVAS_SIZE,
    BLOCKS_COUNT,
    PLAYER_SPEED
} = require('../config/config');
const {
    checkBoundaries,
    checkTerrainInDirection
} = require('../utils/helpers');

class PlayerState {
    constructor(coordinates, id) {
        const deltaToCenter = (CANVAS_SIZE / BLOCKS_COUNT) / 2;

        this.id = id;
        this.coordinates = {
            x: coordinates.x + deltaToCenter,
            y: coordinates.y + deltaToCenter
        };
        this.score = 0;
        this.isMoving = false;
        this.isFiring = false;
        this.canFire = true;
        this.direction = DIRECTIONS.UP.name;
    }

    move(direction, terrainInDirection1, terrainInDirection2) {
        this.direction = direction;
        const { x, y } = this.coordinates;
        const nextPosition = {
            x: x + this.direction.x * PLAYER_SPEED,
            y: y + this.direction.y * PLAYER_SPEED
        };

        if (checkBoundaries(nextPosition) &&
            checkTerrainInDirection(this, terrainInDirection1) &&
            checkTerrainInDirection(this, terrainInDirection2)) {
            this.coordinates = nextPosition;
        }
    }

    increaseScore() {
        this.score += 1;
    }
}

module.exports = PlayerState;
