import { RandomObject } from '../utils';
import { BasicShape } from './BasicShape';
export declare class Cluster implements BasicShape {
    readonly basis: BasicShape;
    readonly countMean: number;
    readonly countDeviation: number;
    readonly deviationX: number;
    readonly deviationY: number;
    readonly deviationZ: number;
    constructor(basis: BasicShape, countMean?: number, countDeviation?: number, deviationX?: number, deviationY?: number, deviationZ?: number);
    Generate(random: RandomObject): Generator<import("./ShapeStar").ShapeStar, void, unknown>;
}
