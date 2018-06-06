const {
    PLAYER_SIZE,
    CANVAS_SIZE,
    PLAYER_SPEED,
    BLOCKS_COUNT
} = require('../config/config');
const {
    TERRAIN_TYPES,
    DIRECTIONS,
    CLICK_EVENTS
} = require('../config/constants');
const TerrainFactory = require('./terrain-factory');

class Helpers {
    static getDirectionFromEvent(event) {
        return Object.keys(DIRECTIONS)
            .map(key => DIRECTIONS[key])
            .find(direction => direction.eventName === event.name);
    }

    static checkBulletIsHittingPlayer(bulletPos, playerPos) {
        const size = PLAYER_SIZE / 2 - 3;
        const inX = bulletPos.x >= playerPos.x - size && bulletPos.x <= playerPos.x + size;
        const inY = bulletPos.y >= playerPos.y - size && bulletPos.y <= playerPos.y + size;

        return inX && inY;
    }

    static checkBulletIsHittingBarrier({ x, y }, { xMin, xMax, yMin, yMax}) {
        const inX = x >= xMin && x <= xMax;
        const inY = y >= yMin && y <= yMax;

        return inX && inY;
    }

    static checkBoundariesForBullet({ x, y }) {
        return x > 0 && x < CANVAS_SIZE && y > 0 && y < CANVAS_SIZE;
    }

    static checkBoundaries({ x, y }) {
        const size = PLAYER_SIZE / 2 - 3;
        return x > size && x < CANVAS_SIZE - size && y > size && y < CANVAS_SIZE - size;
    }

    static checkTerrainInDirection(player, terrainInDirection) {
        if (!terrainInDirection || terrainInDirection.type === TERRAIN_TYPES.GRASS) return true;
        const size = PLAYER_SIZE / 2;
        const { x, y } = player.coordinates;
        const { xMin, yMin, xMax, yMax } = terrainInDirection;
        const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

        if (player.direction.name === UP.name || player.direction.name === DOWN.name) {
            return Math.min(Math.abs(yMin - y), Math.abs(yMax - y)) > size + PLAYER_SPEED;
        }

        if (player.direction.name === LEFT.name || player.direction.name === RIGHT.name) {
            return Math.min(Math.abs(xMin - x), Math.abs(xMax - x)) > size;
        }
    }

    static getPlayerFrontPoints({ x, y }, direction) {
        const size = PLAYER_SIZE / 2 - 3;
        const nextX = x + direction.x * PLAYER_SPEED;
        const nextY = y + direction.y * PLAYER_SPEED;
        const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

        switch (direction.name) {
            case UP.name:
                return {
                    rightPoint: { x: nextX + size, y: nextY - size },
                    leftPoint: { x: nextX - size, y: nextY - size }
                };
            case DOWN.name:
                return {
                    rightPoint: { x: nextX + size, y: nextY + size },
                    leftPoint: { x: nextX - size, y: nextY + size }
                };
            case LEFT.name:
                return {
                    rightPoint: { x: nextX + size, y: nextY + size },
                    leftPoint: { x: nextX + size, y: nextY - size }
                };
            case RIGHT.name:
                return {
                    rightPoint: { x: nextX - size, y: nextY + size },
                    leftPoint: { x: nextX - size, y: nextY - size }
                };
        }
    }

    static getRandomGrassTerrain(terrain) {
        const grassTerrains = [];

        for (let i = 0; i < BLOCKS_COUNT; i++) {
            for (let j = 0; j < BLOCKS_COUNT; j++) {
                if (terrain[i][j].type === TERRAIN_TYPES.GRASS) {
                    grassTerrains.push(terrain[i][j]);
                }
            }
        }

        const n = Math.floor(Math.random() * grassTerrains.length);

        return grassTerrains[n];
    }

    static findTerrainByCoordinates({ x, y }, terrain) {
        for (let i = 0; i < BLOCKS_COUNT; i++) {
            for (let j = 0; j < BLOCKS_COUNT; j++) {
                let { xMin, yMin, xMax, yMax } = terrain[i][j];
                if (x >= xMin && y >= yMin && x <= xMax && y <= yMax) {
                    return { i, j };
                }
            }
        }
    }

    static createTerrain() {
        const terrain = [];
        const barriers = [];
        const terrainFactory = new TerrainFactory();

        for (let i = 0; i < BLOCKS_COUNT; i++) {
            const terrainRow = [];

            for (let j = 0; j < BLOCKS_COUNT; j++) {
                const terrainItem = terrainFactory.getTerrain({ i, j });

                terrainRow.push(terrainItem);
                if (terrainItem.type !== TERRAIN_TYPES.GRASS) {
                    barriers.push(terrainItem);
                }
            }
            terrain.push(terrainRow);
        }
        return { terrain, barriers };
    }
}

module.exports = Helpers;
