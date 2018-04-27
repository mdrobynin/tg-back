const config = {
    CANVAS_SIZE: 600,
    BLOCKS_COUNT: 15,
    KEYS: {
        up: 87,
        left: 65,
        right: 68,
        down: 83,
        fire: 32
    },
    player: {
        speed: 5,
        size: 30
    },
    bullet: {
        speed: 12,
        size: 5,
        fireDelay: 300
    }
};

module.exports = config;
