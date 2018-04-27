const config = require('../config/config');
const TerrainState = require('../models/terrain-state');
const constants = require('../config/constants');

class TerrainFactory {
    constructor() {
        this.terrainWidth = config.CANVAS_SIZE / config.BLOCKS_COUNT;
    }

    getTerrain({i, j}, terrainType) {
        const width = this.terrainWidth;
        const type = terrainType || TerrainFactory.getRandomType();
        return new TerrainState({ y: i * width, x: j * width }, type, width)
    }

    static getRandomType() {
        const arr = Object.keys(constants.terrainTypes);
        const rand = Math.random();
        if (rand < 0.5) {
            return constants.terrainTypes[arr[0]];
        } else if (rand > 0.5 && rand < 0.75) {
            return constants.terrainTypes[arr[1]];
        } else {
            return constants.terrainTypes[arr[2]];
        }
    }
}

module.exports = TerrainFactory;
