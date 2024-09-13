import { RandomObject } from '../utils';
import { BasicShape } from './BasicShape';
export type SpiralShapeOptions = {
    /** Min. 120 */
    size: number;
    swirl: number;
    /** Min space between stars */
    spacing: number;
    minimumArms: number;
    maximumArms: number;
    clusterCountDeviation: number;
    clusterCenterDeviation: number;
    minArmClusterScale: number;
    armClusterScaleDeviation: number;
    maxArmClusterScale: number;
    centerClusterScale: number;
    centerClusterDensityMean: number;
    centerClusterDensityDeviation: number;
    centerClusterSizeDeviation: number;
    centerClusterCountMean: number;
    centerClusterCountDeviation: number;
    centerClusterPositionDeviation: number;
    centralVoidSizeMean: number;
    centralVoidSizeDeviation: number;
};
export declare class Spiral implements BasicShape {
    readonly options: SpiralShapeOptions;
    constructor(options?: Partial<SpiralShapeOptions>);
    Generate(random: RandomObject): Generator<import("./ShapeStar").ShapeStar, void, unknown>;
    GenerateBackgroundStars(random: RandomObject): Generator<import("./ShapeStar").ShapeStar, void, unknown>;
    GenerateArms(random: RandomObject): Generator<import("./ShapeStar").ShapeStar, void, unknown>;
    GenerateCenter(random: RandomObject): Generator<import("./ShapeStar").ShapeStar, void, unknown>;
}
