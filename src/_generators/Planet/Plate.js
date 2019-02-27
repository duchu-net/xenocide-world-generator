class Plate {
	constructor(id, color, driftAxis, driftRate, spinRate, elevation, oceanic, root) {
		this.id = id
		this.color = color
		this.driftAxis = driftAxis
		this.driftRate = driftRate
		this.spinRate = spinRate
		this.elevation = elevation
		this.oceanic = oceanic
		this.root = root
		this.tiles = []
		this.boundaryCorners = []
		this.boundaryBorders = []
	}

	calculateMovement(position){
		var movement = this.driftAxis.clone().cross(position).setLength(this.driftRate * position.clone().projectOnVector(this.driftAxis).distanceTo(position))
		movement.add(this.root.position.clone().cross(position).setLength(this.spinRate * position.clone().projectOnVector(this.root.position).distanceTo(position)))
		return movement
	}

	toJSON(key) {
		return {
			id: this.id,
			color: this.color,
			driftAxis: this.driftAxis,
			driftRate: this.driftRate,
			spinRate: this.spinRate,
			elevation: this.elevation,
			oceanic: this.oceanic,
			root: this.root.id, // corner
			tiles: this.tiles.map(tile => tile.id),
			boundaryCorners: this.boundaryCorners.map(corner => corner.id),
			boundaryBorders: this.boundaryBorders.map(border => border.id),
		}
	}
}

export default Plate
