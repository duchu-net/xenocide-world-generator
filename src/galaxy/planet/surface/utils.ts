import { Color, Plane, Sphere, Vector3 } from 'three';

export class Corner {
  corners: Corner[];
  borders: Border[];
  tiles: Tile[];

  area?: number;
  elevation?: number;
  distanceToPlateBoundary?: number;
  distanceToPlateRoot?: number;
  betweenPlates?: boolean;
  shear?: number;
  pressure?: number;

  // weather
  airHeat?: number;
  newAirHeat?: number;
  maxHeat?: number;
  heat?: number;
  airCurrent?: Vector3;
  airCurrentSpeed?: number;
  airCurrentOutflows?: number[];
  heatAbsorption?: number;
  temperature?: number;
  airMoisture?: number;
  newAirMoisture?: number;
  precipitation?: number;
  precipitationRate?: number;
  maxPrecipitation?: number;
  moisture?: number;

  constructor(
    public id: number,
    public position: Vector3,
    cornerCount: number,
    borderCount: number,
    tileCount: number
  ) {
    this.corners = new Array(cornerCount);
    this.borders = new Array(borderCount);
    this.tiles = new Array(tileCount);
  }

  vectorTo(corner: Corner) {
    return corner.position.clone().sub(this.position);
  }

  toString() {
    return (
      'Corner ' +
      this.id.toFixed(0) +
      ' < ' +
      this.position.x.toFixed(0) +
      ', ' +
      this.position.y.toFixed(0) +
      ', ' +
      this.position.z.toFixed(0) +
      ' >'
    );
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

export class Border {
  corners: Corner[];
  borders: Border[];
  tiles: Tile[];

  midpoint?: Vector3;
  betweenPlates?: boolean;

  constructor(public id: number, cornerCount: number, borderCount: number, tileCount: number) {
    this.id = id;
    this.corners = new Array(cornerCount);
    this.borders = new Array(borderCount);
    this.tiles = new Array(tileCount);
  }

  oppositeCorner(corner: Corner) {
    return this.corners[0] === corner ? this.corners[1] : this.corners[0];
  }

  oppositeTile(tile: Tile) {
    return this.tiles[0] === tile ? this.tiles[1] : this.tiles[0];
  }

  length() {
    return this.corners[0].position.distanceTo(this.corners[1].position);
  }

  isLandBoundary() {
    return (this.tiles[0].elevation as number) > 0 !== (this.tiles[1].elevation as number) > 0;
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

export class Tile {
  corners: Corner[];
  borders: Border[];
  tiles: Tile[];

  area?: number;
  normal?: Vector3;
  averagePosition?: Vector3;
  boundingSphere?: Sphere;
  elevation?: number;
  maxDistanceToCorner?: number;
  plate?: Plate;
  biome?: string;
  color?: Color;
  moisture?: number;
  temperature?: number;

  constructor(
    public id: number,
    public position: Vector3,
    cornerCount: number,
    borderCount: number,
    tileCount: number
  ) {
    this.corners = new Array(cornerCount);
    this.borders = new Array(borderCount);
    this.tiles = new Array(tileCount);
  }

  intersectRay(ray: any) {
    if (!this.intersectRayWithSphere(ray, this.boundingSphere as Sphere)) return false;

    const surface = new Plane().setFromNormalAndCoplanarPoint(this.normal as Vector3, this.averagePosition as Vector3);
    if (surface.distanceToPoint(ray.origin) <= 0) return false;

    const denominator = surface.normal.dot(ray.direction);
    if (denominator === 0) return false;

    const t = -(ray.origin.dot(surface.normal) + surface.constant) / denominator;
    const point = ray.direction.clone().multiplyScalar(t).add(ray.origin);

    const origin = new Vector3(0, 0, 0);
    for (let i = 0; i < this.corners.length; ++i) {
      const j = (i + 1) % this.corners.length;
      const side = new Plane().setFromCoplanarPoints(this.corners[j].position, this.corners[i].position, origin);

      if (side.distanceToPoint(point) < 0) return false;
    }
    return true;
  }

  intersectRayWithSphere(ray: any, sphere: Sphere) {
    const v1 = sphere.center.clone().sub(ray.origin);
    const v2 = v1.clone().projectOnVector(ray.direction);
    const d = v1.distanceTo(v2);
    return d <= sphere.radius;
  }

  toString() {
    return (
      'Tile ' +
      this.id.toFixed(0) +
      ' (' +
      this.tiles.length.toFixed(0) +
      ' Neighbors) < ' +
      this.position.x.toFixed(0) +
      ', ' +
      this.position.y.toFixed(0) +
      ', ' +
      this.position.z.toFixed(0) +
      ' >'
    );
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

export class SpatialPartition {
  constructor(public boundingSphere: Sphere, public partitions: SpatialPartition[], public tiles: Tile[]) {}

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

export class Plate {
  tiles: Tile[] = [];
  boundaryCorners: Corner[] = [];
  boundaryBorders: Border[] = [];
  constructor(
    public id: number,
    public color: Color,
    public driftAxis: Vector3,
    public driftRate: number,
    public spinRate: number,
    public elevation: number,
    public oceanic: boolean,
    public root: Corner
  ) {}

  calculateMovement(position: Vector3) {
    var movement = this.driftAxis
      .clone()
      .cross(position)
      .setLength(this.driftRate * position.clone().projectOnVector(this.driftAxis).distanceTo(position));
    movement.add(
      this.root.position
        .clone()
        .cross(position)
        .setLength(this.spinRate * position.clone().projectOnVector(this.root.position).distanceTo(position))
    );
    return movement;
  }

  // toJSON() {
  //   return {
  //     id: this.id,
  //     color: this.color,
  //     driftAxis: this.driftAxis,
  //     driftRate: this.driftRate,
  //     spinRate: this.spinRate,
  //     elevation: this.elevation,
  //     oceanic: this.oceanic,
  //     root: this.root.id, // corner
  //     tiles: this.tiles.map((tile) => tile.id),
  //     boundaryCorners: this.boundaryCorners.map((corner) => corner.id),
  //     boundaryBorders: this.boundaryBorders.map((border) => border.id),
  //   };
  // }
}
