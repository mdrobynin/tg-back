class TerrainState {
    constructor(coordinates, type, width) {
        const { x, y } = coordinates;

        this.coordinates = coordinates;
        this.type = type;
        this.xMin = x;
        this.yMin = y;
        this.xMax = x + width;
        this.yMax = y + width;
    }
}

module.exports = TerrainState;
