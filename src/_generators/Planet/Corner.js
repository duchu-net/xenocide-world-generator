class Corner{
	constructor(id, position, cornerCount, borderCount, tileCount){
		this.id = id;
		this.position = position;
		this.corners = new Array(cornerCount);
		this.borders = new Array(borderCount);
		this.tiles = new Array(tileCount);
	}

	vectorTo(corner){
		return corner.position.clone().sub(this.position);
	}

	toString(){
		return "Corner " + this.id.toFixed(0) + " < " + this.position.x.toFixed(0) + ", " + this.position.y.toFixed(0) + ", " + this.position.z.toFixed(0) + " >";
	}

	toJSON(key) {
		return {
			id: this.id,
			position: this.position,
			corners: this.corners.map(corner => corner.id),
			borders: this.borders.map(border => border.id),
			tiles: this.tiles.map(tile => tile.id)
		}
	}
}

export default Corner;
