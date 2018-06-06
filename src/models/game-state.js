const {
    TERRAIN_TYPES,
    DIRECTIONS
} = require('../config/constants');
const {
    checkBoundariesForBullet,
    getRandomGrassTerrain,
    findTerrainByCoordinates,
    createTerrain,
    checkBulletIsHittingPlayer,
    checkBulletIsHittingBarrier
} = require('../utils/helpers');

class GameState {
    constructor() {
        this.players = [];
        this.terrain = [];
        this.bullets = [];
        this.bulletsToDelete = [];
        this.playersToDelete = [];
        this.barriersToDelete = [];
        this.barriers = [];
        this._initializeTerrain();
    }

    handleBulletsMovement() {
        this.bullets.forEach(bullet => {
            bullet.move();
            const isInScreen = checkBoundariesForBullet(bullet.coordinates);
            if (!isInScreen) this.bulletsToDelete.push(bullet);
        });
    }

    checkBulletsHitting() {
        this.barriersToDelete = [];
        this.bulletsToDelete = [];
        this.playersToDelete = [];

        this.bullets.forEach(bullet => {
            this.players.filter(player => player !== bullet.player).forEach(player => {
                if (checkBulletIsHittingPlayer(bullet.coordinates, player.coordinates)) {
                    this.playersToDelete.push(player);
                    this.bulletsToDelete.push(bullet);
                    if (bullet.player) {
                        bullet.player.increaseScore();
                    }
                }
            });
            this.barriers.forEach(barrier => {
                if (checkBulletIsHittingBarrier(bullet.coordinates, barrier)) {
                    this.barriersToDelete.push(barrier);
                    this.bulletsToDelete.push(bullet);
                }
            });
        });
    }

    removeOutOfScreenBullets() {
        this.bullets = this.bullets.filter(bullet => this.bulletsToDelete.indexOf(bullet) === -1);
    }

    removeBrokenWalls() {
        this.barriersToDelete.forEach(barrier => {
            if (barrier.type === TERRAIN_TYPES.WALL) {
                barrier.type = TERRAIN_TYPES.GRASS;
                this.barriers.splice(this.barriers.indexOf(barrier), 1);
            }
        });
    }

    removeDeadPlayers() {
        this.players = this.players.filter(player => this.playersToDelete.indexOf(player) === -1);
    }

    removePlayerBullets(player) {
        this.bullets = this.bullets.filter(bullet => bullet.player !== player);
    }

    removePlayerIfExists(player) {
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1) this.players.splice(playerIndex, 1);
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

    getRandomGrassTerrainCoordinates() {
        return getRandomGrassTerrain(this.terrain).coordinates;
    }

    _getRelativeTerrain({ i, j }, direction) {
        const { UP, DOWN, LEFT, RIGHT } = DIRECTIONS;

        switch (direction.name) {
            case UP.name:
                if (!this.terrain[i - 1]) return;
                return this.terrain[i - 1][j];
            case DOWN.name:
                if (!this.terrain[i + 1]) return;
                return this.terrain[i + 1][j];
            case LEFT.name:
                return this.terrain[i][j - 1];
            case RIGHT.name:
                return this.terrain[i][j + 1];
        }
    }

    _findTerrainByCoordinates({ x, y }) {
        return findTerrainByCoordinates({ x, y }, this.terrain);
    }

    _initializeTerrain() {
        const { terrain, barriers } = createTerrain();
        this.terrain = terrain;
        this.barriers = barriers;
    }
}

module.exports = GameState;
