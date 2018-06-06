const {
    CANVAS_SIZE,
    BLOCKS_COUNT
} = require('../config/config');
const {
    TERRAIN_TYPES
} = require('../config/constants');
const TerrainState = require('../models/terrain-state');

class TerrainFactory {
    constructor() {
        this.terrainWidth = CANVAS_SIZE / BLOCKS_COUNT;
    }

    getTerrain({i, j}, terrainType) {
        const width = this.terrainWidth;
        const type = terrainType || TerrainFactory.getRandomTerrainType();

        return new TerrainState({ y: i * width, x: j * width }, type, width);
    }

    static getRandomTerrainType() {
        const rand = Math.random();

        switch (true) {
            case rand < 0.5: return TERRAIN_TYPES.GRASS;
            case rand > 0.5 && rand < 0.75: return TERRAIN_TYPES.STONE;
            default: return TERRAIN_TYPES.WALL;
        }
    }
}

module.exports = TerrainFactory;
