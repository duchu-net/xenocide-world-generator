class Plate {
	constructor(color, driftAxis, driftRate, spinRate, elevation, oceanic, root) {
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
}

export default Plate
