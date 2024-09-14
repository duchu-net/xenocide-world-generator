"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plate = exports.SpatialPartition = exports.Tile = exports.Border = exports.Corner = void 0;
const three_1 = require("three");
class Corner {
    constructor(id, position, cornerCount, borderCount, tileCount) {
        this.id = id;
        this.position = position;
        this.corners = new Array(cornerCount);
        this.borders = new Array(borderCount);
        this.tiles = new Array(tileCount);
    }
    vectorTo(corner) {
        return corner.position.clone().sub(this.position);
    }
    toString() {
        return ('Corner ' +
            this.id.toFixed(0) +
            ' < ' +
            this.position.x.toFixed(0) +
            ', ' +
            this.position.y.toFixed(0) +
            ', ' +
            this.position.z.toFixed(0) +
            ' >');
    }
    toJSON() {
        return {
            id: this.id,
            position: this.position,
            corners: this.corners.map((corner) => corner.id),
            borders: this.borders.map((border) => border.id),
            tiles: this.tiles.map((tile) => tile.id),
        };
    }
}
exports.Corner = Corner;
class Border {
    constructor(id, cornerCount, borderCount, tileCount) {
        this.id = id;
        this.id = id;
        this.corners = new Array(cornerCount);
        this.borders = new Array(borderCount);
        this.tiles = new Array(tileCount);
    }
    oppositeCorner(corner) {
        return this.corners[0] === corner ? this.corners[1] : this.corners[0];
    }
    oppositeTile(tile) {
        return this.tiles[0] === tile ? this.tiles[1] : this.tiles[0];
    }
    length() {
        return this.corners[0].position.distanceTo(this.corners[1].position);
    }
    isLandBoundary() {
        return this.tiles[0].elevation > 0 !== this.tiles[1].elevation > 0;
    }
    toString() {
        return 'Border ' + this.id.toFixed(0);
    }
    toJSON() {
        return {
            id: this.id,
            corners: this.corners.map((corner) => corner.id),
            borders: this.borders.map((border) => border.id),
            tiles: this.tiles.map((tile) => tile.id),
        };
    }
}
exports.Border = Border;
class Tile {
    constructor(id, position, cornerCount, borderCount, tileCount) {
        this.id = id;
        this.position = position;
        this.corners = new Array(cornerCount);
        this.borders = new Array(borderCount);
        this.tiles = new Array(tileCount);
    }
    intersectRay(ray) {
        if (!this.intersectRayWithSphere(ray, this.boundingSphere))
            return false;
        const surface = new three_1.Plane().setFromNormalAndCoplanarPoint(this.normal, this.averagePosition);
        if (surface.distanceToPoint(ray.origin) <= 0)
            return false;
        const denominator = surface.normal.dot(ray.direction);
        if (denominator === 0)
            return false;
        const t = -(ray.origin.dot(surface.normal) + surface.constant) / denominator;
        const point = ray.direction.clone().multiplyScalar(t).add(ray.origin);
        const origin = new three_1.Vector3(0, 0, 0);
        for (let i = 0; i < this.corners.length; ++i) {
            const j = (i + 1) % this.corners.length;
            const side = new three_1.Plane().setFromCoplanarPoints(this.corners[j].position, this.corners[i].position, origin);
            if (side.distanceToPoint(point) < 0)
                return false;
        }
        return true;
    }
    intersectRayWithSphere(ray, sphere) {
        const v1 = sphere.center.clone().sub(ray.origin);
        const v2 = v1.clone().projectOnVector(ray.direction);
        const d = v1.distanceTo(v2);
        return d <= sphere.radius;
    }
    toString() {
        return ('Tile ' +
            this.id.toFixed(0) +
            ' (' +
            this.tiles.length.toFixed(0) +
            ' Neighbors) < ' +
            this.position.x.toFixed(0) +
            ', ' +
            this.position.y.toFixed(0) +
            ', ' +
            this.position.z.toFixed(0) +
            ' >');
    }
    // fromJSON() {}
    toJSON() {
        return {
            id: this.id,
            position: this.position,
            tiles: this.tiles.map((tile) => tile.id),
            corners: this.corners.map((corner) => corner.id),
            borders: this.borders.map((border) => border.id),
            normal: this.normal,
            averagePosition: this.averagePosition,
            maxDistanceToCorner: this.maxDistanceToCorner,
            plate: this.plate ? this.plate.id : undefined,
            area: this.area,
            biome: this.biome,
            color: this.color,
            moisture: this.moisture,
            elevation: this.elevation,
            temperature: this.temperature,
        };
    }
}
exports.Tile = Tile;
class SpatialPartition {
    constructor(boundingSphere, partitions, tiles) {
        this.boundingSphere = boundingSphere;
        this.partitions = partitions;
        this.tiles = tiles;
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
    toJSON() {
        return {
            boundingSphere: this.boundingSphere,
            tiles: this.tiles.map((tile) => tile.id),
            // tiles: this.tiles,
            partitions: this.partitions,
        };
    }
}
exports.SpatialPartition = SpatialPartition;
class Plate {
    constructor(id, color, driftAxis, driftRate, spinRate, elevation, oceanic, root) {
        this.id = id;
        this.color = color;
        this.driftAxis = driftAxis;
        this.driftRate = driftRate;
        this.spinRate = spinRate;
        this.elevation = elevation;
        this.oceanic = oceanic;
        this.root = root;
        this.tiles = [];
        this.boundaryCorners = [];
        this.boundaryBorders = [];
    }
    calculateMovement(position) {
        var movement = this.driftAxis
            .clone()
            .cross(position)
            .setLength(this.driftRate * position.clone().projectOnVector(this.driftAxis).distanceTo(position));
        movement.add(this.root.position
            .clone()
            .cross(position)
            .setLength(this.spinRate * position.clone().projectOnVector(this.root.position).distanceTo(position)));
        return movement;
    }
}
exports.Plate = Plate;
