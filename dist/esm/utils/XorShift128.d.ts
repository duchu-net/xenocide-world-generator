export type Seed = number;
export declare class XorShift128 {
    private x;
    private y;
    private z;
    private w;
    constructor(x?: Seed, y?: Seed, z?: Seed, w?: Seed);
    next(): number;
    unit(): number;
    unitInclusive(): number;
    integer(min: number, max: number): number;
    integerExclusive(min: number, max: number): number;
    real(min: number, max: number): number;
    realInclusive(min: number, max: number): number;
    reseed(x: Seed, y: Seed, z: Seed, w: Seed): void;
}
export default XorShift128;
