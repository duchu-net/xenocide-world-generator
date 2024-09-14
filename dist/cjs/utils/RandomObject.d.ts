import XorShift128 from './XorShift128';
export declare class RandomObject {
    _random: XorShift128;
    get random(): XorShift128;
    set random(rand: XorShift128);
    constructor(random: any);
    choice(list: any): any;
    weighted(list: [] | {}): any;
    Next(max?: number): number;
    next(max?: number): number;
    unit(): number;
    integer(min: number, max: number): number;
    integerExclusive(min: number, max: number): number;
    real(min: number, max: number): number;
    realInclusive(min: number, max: number): number;
    seed(): number;
    NormallyDistributedSingle(standardDeviation: number, mean: number): number;
    NormallyDistributedSingle4(standardDeviation: number, mean: number, min: number, max: number): number;
    static randomSeed(): number;
}
export default RandomObject;
