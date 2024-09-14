import { Vector3 } from 'three';
interface ShapeStarModel {
    position: Vector3;
    temperature?: number;
    galaxy_size?: number;
}
export declare class ShapeStar {
    position: Vector3;
    temperature?: number;
    galaxy_size?: number;
    constructor(model: ShapeStarModel);
    Offset(offset: Vector3): this;
    swirl(axis: Vector3, amount: number): this;
}
export {};
