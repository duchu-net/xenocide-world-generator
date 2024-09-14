import { Color, Sphere, Vector3 } from 'three';
export declare class Corner {
    id: number;
    position: Vector3;
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
    constructor(id: number, position: Vector3, cornerCount: number, borderCount: number, tileCount: number);
    vectorTo(corner: Corner): Vector3;
    toString(): string;
    toJSON(): {
        id: number;
        position: Vector3;
        corners: number[];
        borders: number[];
        tiles: number[];
    };
}
export declare class Border {
    id: number;
    corners: Corner[];
    borders: Border[];
    tiles: Tile[];
    midpoint?: Vector3;
    betweenPlates?: boolean;
    constructor(id: number, cornerCount: number, borderCount: number, tileCount: number);
    oppositeCorner(corner: Corner): Corner;
    oppositeTile(tile: Tile): Tile;
    length(): number;
    isLandBoundary(): boolean;
    toString(): string;
    toJSON(): {
        id: number;
        corners: number[];
        borders: number[];
        tiles: number[];
    };
}
export declare class Tile {
    id: number;
    position: Vector3;
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
    constructor(id: number, position: Vector3, cornerCount: number, borderCount: number, tileCount: number);
    intersectRay(ray: any): boolean;
    intersectRayWithSphere(ray: any, sphere: Sphere): boolean;
    toString(): string;
    toJSON(): {
        id: number;
        position: Vector3;
        tiles: number[];
        corners: number[];
        borders: number[];
        normal: Vector3 | undefined;
        averagePosition: Vector3 | undefined;
        maxDistanceToCorner: number | undefined;
        plate: number | undefined;
        area: number | undefined;
        biome: string | undefined;
        color: Color | undefined;
        moisture: number | undefined;
        elevation: number | undefined;
        temperature: number | undefined;
    };
}
export declare class SpatialPartition {
    boundingSphere: Sphere;
    partitions: SpatialPartition[];
    tiles: Tile[];
    constructor(boundingSphere: Sphere, partitions: SpatialPartition[], tiles: Tile[]);
    toJSON(): {
        boundingSphere: Sphere;
        tiles: number[];
        partitions: SpatialPartition[];
    };
}
export declare class Plate {
    id: number;
    color: Color;
    driftAxis: Vector3;
    driftRate: number;
    spinRate: number;
    elevation: number;
    oceanic: boolean;
    root: Corner;
    tiles: Tile[];
    boundaryCorners: Corner[];
    boundaryBorders: Border[];
    constructor(id: number, color: Color, driftAxis: Vector3, driftRate: number, spinRate: number, elevation: number, oceanic: boolean, root: Corner);
    calculateMovement(position: Vector3): Vector3;
}
