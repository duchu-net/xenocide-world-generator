import { RandomObject } from '../utils';
import { BasicShape } from './BasicShape';
import { ShapeStar } from './ShapeStar';
export declare class Sphere implements BasicShape {
    readonly size: number;
    readonly densityMean: number;
    readonly densityDeviation: number;
    readonly deviationX: number;
    readonly deviationY: number;
    readonly deviationZ: number;
    constructor(size?: number, densityMean?: number, densityDeviation?: number, deviationX?: number, deviationY?: number, deviationZ?: number);
    Generate(random: RandomObject): Generator<ShapeStar, void, unknown>;
}
