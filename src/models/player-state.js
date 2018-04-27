const constants = require('../config/constants');
const config = require('../config/config');
const Helpers = require('../utils/helpers');

class PlayerState {
    constructor(coordinates, id) {
        this.id = id;
        const size = (config.CANVAS_SIZE / config.BLOCKS_COUNT) / 2;
        this.coordinates = { x: coordinates.x + size, y: coordinates.y + size };
        this.direction = constants.directions.up;
    }

    move(direction, terrainInDirection1, terrainInDirection2) {
        this.direction = direction;
        const nextPosition = {
            x: this.coordinates.x + this.direction.x * config.player.speed,
            y: this.coordinates.y + this.direction.y * config.player.speed
        };
        if (Helpers.checkBoundaries(nextPosition) &&
            Helpers.checkTerrainInDirection(this, terrainInDirection1) &&
            Helpers.checkTerrainInDirection(this, terrainInDirection2)) {
            this.coordinates = nextPosition;
        }
    }
}

module.exports = PlayerState;
