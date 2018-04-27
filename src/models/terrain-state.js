class TerrainState {
    constructor(coordinates, type, width) {
        this.coordinates = coordinates;
        this.type = type;
        this.xMin = coordinates.x;
        this.yMin = coordinates.y;
        this.xMax = coordinates.x + width;
        this.yMax = coordinates.y + width;
    }
}

module.exports = TerrainState;
