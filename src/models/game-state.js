const constants = require('../config/constants');
const config = require('../config/config');
const TerrainFactory = require('../utils/terrain-factory');
const Helpers = require('../utils/helpers');

class GameState {
    constructor() {
        this.players = [];
        this.terrain = [];
        this.bullets = [];
        this.bulletsToDelete = [];
        this.playersToDelete = [];
        this.barriersToDelete = [];
        this.barriers = [];
        this._createTerrain();
    }

    handleBulletsMovement() {
        this.bullets.forEach(b => {
            const isInScreen = b.move();
            if (!isInScreen) {
                this.bulletsToDelete.push(b);
            }
        });
    }

    checkBulletsHitting() {
        this.barriersToDelete = [];
        this.bulletsToDelete = [];
        this.playersToDelete = [];

        this.bullets.forEach(b => {
            this.players.filter(x => x !== b.player).forEach(p => {
                if (Helpers.checkBulletIsHittingPlayer(b.coordinates, p.coordinates)) {
                    this.playersToDelete.push(p);
                    this.bulletsToDelete.push(b);
                }
            });
            this.barriers.forEach(bar => {
                if (Helpers.checkBulletIsHittingBarrier(b.coordinates, bar)) {
                    this.barriersToDelete.push(bar);
                    this.bulletsToDelete.push(b);
                }
            });
        });
    }

    removeOutOfScreenBullets() {
        this.bullets = this.bullets.filter(b => this.bulletsToDelete.indexOf(b) === -1);
    }

    removePlayerBullets(player) {
        this.bullets = this.bullets.filter(b => b.player !== player);
    }

    removeBrokenWalls() {
        this.barriersToDelete.forEach(b => {
            if (b.type === constants.terrainTypes.wall) {
                b.type = constants.terrainTypes.grass;
                this.barriers.splice(this.barriers.indexOf(b), 1);
            }
        });
    }

    removeDeadPlayers() {
        this.players = this.players.filter(p => this.playersToDelete.indexOf(p) === -1);
    }

    removePlayerIfExists(player) {
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
        }
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getTerrainInDirection(coordinates, direction) {
        const indexes = this._findTerrainByCoordinates(coordinates);
        if (!indexes) return;
        return this._getRelativeTerrain(indexes, direction);
    }

    getRandomGrassTerrain() {
        const grassTerrains = [];
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                if (this.terrain[i][j].type === constants.terrainTypes.grass) {
                    grassTerrains.push(this.terrain[i][j]);
                }
            }
        }
        const n = Math.floor(Math.random() * grassTerrains.length);
        return grassTerrains[n];
    }

    _getRelativeTerrain({i, j}, direction) {
        switch (direction) {
            case constants.directions.up:
                if (this.terrain[i - 1]) {
                    return this.terrain[i - 1][j];
                }
                break;
            case constants.directions.down:
                if (this.terrain[i + 1]) {
                    return this.terrain[i + 1][j];
                }
                break;
            case constants.directions.left:
                return this.terrain[i][j - 1];
            case constants.directions.right:
                return this.terrain[i][j + 1];
        }
    }

    _findTerrainByCoordinates({x, y}) {
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                let { xMin, yMin, xMax, yMax } = this.terrain[i][j];
                if (x >= xMin && y >= yMin && x <= xMax && y <= yMax) {
                    return { i, j };
                }
            }
        }
    }

    _createTerrain() {
        const terrainFactory = new TerrainFactory();
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            const arr = [];
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                const terrain = terrainFactory.getTerrain({ i, j });
                arr.push(terrain);
                if (terrain.type !== constants.terrainTypes.grass) {
                    this.barriers.push(terrain);
                }
            }
            this.terrain.push(arr);
        }
    }
}

module.exports = GameState;
