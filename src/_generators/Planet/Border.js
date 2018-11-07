class Border{
	constructor(id, cornerCount, borderCount, tileCount){
		this.id = id;
		this.corners = new Array(cornerCount);
		this.borders = new Array(borderCount);
		this.tiles = new Array(tileCount);
	}

	oppositeCorner(corner){
		return (this.corners[0] === corner) ? this.corners[1] : this.corners[0];
	}

	oppositeTile(tile){
		return (this.tiles[0] === tile) ? this.tiles[1] : this.tiles[0];
	}

	length(){
		return this.corners[0].position.distanceTo(this.corners[1].position);
	}

	isLandBoundary(){
		return (this.tiles[0].elevation > 0) !== (this.tiles[1].elevation > 0);
	}

	toString(){
		return "Border " + this.id.toFixed(0);
	}

	toJSON(key) {
		return {
			id: this.id,
			corners: this.corners.map(corner => corner.id),
			borders: this.borders.map(border => border.id),
			tiles: this.tiles.map(tile => tile.id)
		}
	}
}

export default Border;
