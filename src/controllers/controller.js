const PlayerState = require('../models/player-state');
const BulletState = require('../models/bullet-state');
const config = require('../config/config');
const Helpers = require('../utils/helpers');

class Controller {
    constructor(observable, gameState, socketId) {
        this.socketId = socketId;
        this.observable = observable;
        this.gameState = gameState;
        this._initialize();
    }

    _initialize() {
        this.currentDirection = undefined;
        this.isPlayerMoving = false;
        this.isPlayerFiring = false;
        this.canPlayerFire = true;

        this.player = new PlayerState(this.gameState.getRandomGrassTerrain().coordinates, this.socketId);
        this.gameState.addPlayer(this.player);
        this._listenEvents();
    }

    handleMainTick() {
        if (this.isPlayerMoving) {
            const {rightPoint, leftPoint} = Helpers.getPlayerFrontPoints(this.player.coordinates, this.currentDirection);
            const terrain1 = this.gameState.getTerrainInDirection(rightPoint, this.currentDirection);
            const terrain2 = this.gameState.getTerrainInDirection(leftPoint, this.currentDirection);
            this.player.move(this.currentDirection, terrain1, terrain2);
        }
        if (this.isPlayerFiring) this._playerFireHandler();
    }

    onDelete() {
        this.isPlayerFiring = false;
        this.gameState.removePlayerBullets(this.player);
        this.gameState.removePlayerIfExists(this.player);
    }

    _playerFireHandler() {
        if (this.canPlayerFire) {
            this.gameState.addBullet(new BulletState(this.player));
            this.canPlayerFire = false;
            setTimeout(() => {
                this.canPlayerFire = true;
            }, config.bullet.fireDelay);
        }
    }

    _listenEvents() {
        this.observable.subscribe((event) => {
            const direction = Helpers.getDirectionFromEvent(event);
            this.currentDirection = direction || this.currentDirection;
            this.isPlayerFiring = !direction ? event.status : false;
            this.isPlayerMoving = direction ? event.status : false;
        });
    }
}

module.exports = Controller;
