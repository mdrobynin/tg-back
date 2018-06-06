const PlayerState = require('../models/player-state');
const BulletState = require('../models/bullet-state');
const { BULLET_FIRE_DELAY } = require('../config/config');
const {
    getPlayerFrontPoints,
    getDirectionFromEvent
} = require('../utils/helpers');

class Controller {
    constructor(gameState) {
        this.gameState = gameState;
        this.players = gameState.players;
    }

    addPlayer(player, observable) {
        this.gameState.addPlayer(player);
        this.players = this.gameState.players;
        observable.subscribe((event) => {
            const direction = getDirectionFromEvent(event);

            player.direction = direction || player.direction;
            player.isFiring = !direction ? event.status : false;
            player.isMoving = direction ? event.status : false;
        });
    }

    handleMainTick() {
        this.players.forEach(player => {
            if (player.isMoving) {
                const { rightPoint, leftPoint } = getPlayerFrontPoints(player.coordinates, player.direction);
                const terrain1 = this.gameState.getTerrainInDirection(rightPoint, player.direction);
                const terrain2 = this.gameState.getTerrainInDirection(leftPoint, player.direction);

                player.move(player.direction, terrain1, terrain2);
            }
            if (player.isFiring) this._playerFireHandler(player);
        });
    }

    removePlayer(player) {
        player.isFiring = false;
        this.gameState.removePlayerBullets(player);
        this.gameState.removePlayerIfExists(player);
    }

    _playerFireHandler(player) {
        if (player.canFire) {
            this.gameState.addBullet(new BulletState(player));
            player.canFire = false;
            setTimeout(() => {
                player.canFire = true;
            }, BULLET_FIRE_DELAY);
        }
    }
}

module.exports = Controller;
