const CLICK_EVENTS = {
    UP: 'clickUpEvent',
    DOWN: 'clickDownEvent',
    RIGHT: 'clickRightEvent',
    LEFT: 'clickLeftEvent',
    FIRE: 'clickFireEvent'
};

const constants = {
    SOCKET_USER_ACTION_NAME: 'user move action',
    SOCKET_STATE_RECEIVE_ACTION_NAME: 'state receive action',
    SOCKET_JOIN_ROOM_ACTION_NAME: 'join room action',
    SOCKET_LEAVE_ROOM_ACTION_NAME: 'leave room action',
    SOCKET_GET_CONNECTION_ID_ACTION_NAME: 'get connection id action',
    SOCKET_RECONNECT_ACTION: 'reconnect after death action',
    SOCKET_CURRENT_ONLINE_PLAYERS_ACTION: 'current online players action',
    DIRECTIONS: {
        UP: {
            x: 0,
            y: -1,
            name: 'upDirection',
            eventName: CLICK_EVENTS.UP
        },
        DOWN: {
            x: 0,
            y: 1,
            name: 'downDirection',
            eventName: CLICK_EVENTS.DOWN
        },
        RIGHT: {
            x: 1,
            y: 0,
            name: 'rightDirection',
            eventName: CLICK_EVENTS.RIGHT
        },
        LEFT: {
            x: -1,
            y: 0,
            name: 'leftDirection',
            eventName: CLICK_EVENTS.LEFT
        }
    },
    CLICK_EVENTS,
    TERRAIN_TYPES: {
        GRASS: 'grassTerrain',
        STONE: 'stoneTerrain',
        WALL: 'wallTerrain'
    }
};

module.exports = constants;
