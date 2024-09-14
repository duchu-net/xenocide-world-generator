import { RandomObject } from '../utils';
import { BasicShape } from './BasicShape';
import { ShapeStar } from './ShapeStar';
export declare class Grid implements BasicShape {
    readonly size: number;
    readonly spacing: number;
    constructor(size?: number, spacing?: number);
    Generate(random?: RandomObject): Generator<ShapeStar, void, unknown>;
}
