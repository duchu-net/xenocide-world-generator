import * as THREE from 'three-math';

class Tile{
	constructor(id, position, cornerCount, borderCount, tileCount){
		this.id = id;
		this.position = position;
		this.corners = new Array(cornerCount);
		this.borders = new Array(borderCount);
		this.tiles = new Array(tileCount);
	}

	intersectRay(ray){
		if (!this.intersectRayWithSphere(ray, this.boundingSphere))
			return false;

		const surface = new THREE.Plane().setFromNormalAndCoplanarPoint(this.normal, this.averagePosition);
		if (surface.distanceToPoint(ray.origin) <= 0)
			return false;

		const denominator = surface.normal.dot(ray.direction);
		if (denominator === 0)
			return false;

		const t = -(ray.origin.dot(surface.normal) + surface.constant) / denominator;
		const point = ray.direction.clone().multiplyScalar(t).add(ray.origin);

		const origin = new THREE.Vector3(0, 0, 0);
		for (let i = 0; i < this.corners.length; ++i){
			const j = (i + 1) % this.corners.length;
			const side = new THREE.Plane().setFromCoplanarPoints(this.corners[j].position, this.corners[i].position, origin);

			if (side.distanceToPoint(point) < 0)
				return false;
		}
		return true;
	}

	intersectRayWithSphere(ray, sphere){
		const v1 = sphere.center.clone().sub(ray.origin);
		const v2 = v1.clone().projectOnVector(ray.direction);
		const d = v1.distanceTo(v2);
		return (d <= sphere.radius);
	}

	toString(){
		return "Tile " + this.id.toFixed(0) + " (" + this.tiles.length.toFixed(0) + " Neighbors) < " + this.position.x.toFixed(0) + ", " + this.position.y.toFixed(0) + ", " + this.position.z.toFixed(0) + " >";
	}

	// fromJSON() {}
	toJSON(key) {
		return {
			id: this.id,
			position: this.position,
			tiles: this.tiles.map(tile => tile.id),
			corners: this.corners.map(corner => corner.id),
			borders: this.borders.map(border => border.id),

			normal: this.normal,
			averagePosition: this.averagePosition,
			maxDistanceToCorner: this.maxDistanceToCorner,
			plate: this.plate ? this.plate.id : undefined,
			area: this.area,
			biome: this.biome,
			moisture: this.moisture,
			elevation: this.elevation,
			temperature: this.temperature,
		}
	}
}

export default Tile;
