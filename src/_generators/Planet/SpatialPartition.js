// import { intersectRayWithSphere } from '../../utils/utils';

class SpatialPartition{
	constructor(boundingSphere, partitions, tiles) {
		this.boundingSphere = boundingSphere
		this.partitions = partitions
		this.tiles = tiles
	}

	// intersectRay(ray){
	// 	if (intersectRayWithSphere(ray, this.boundingSphere)){
	// 		for (let i = 0; i < this.partitions.length; ++i){
	// 			const intersection = this.partitions[i].intersectRay(ray);
	// 			if (intersection !== false){
	// 				return intersection;
	// 			}
	// 		}
  //
	// 		for (let i = 0; i < this.tiles.length; ++i){
	// 			if (this.tiles[i].intersectRay(ray)){
	// 				return this.tiles[i];
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
	toJSON(key) {
		return {
			boundingSphere: this.boundingSphere,
			tiles: this.tiles.map(tile => tile.id),
			// tiles: this.tiles,
			partitions: this.partitions,
		}
	}
}

export default SpatialPartition
