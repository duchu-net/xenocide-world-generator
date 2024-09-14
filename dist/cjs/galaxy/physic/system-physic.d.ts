export interface SystemPhysicModel {
    color: string;
    starsCount: number;
    planetsCount: number;
    asteroidsCount: number;
}
export declare enum SystemType {
    SINGLE_STAR = "SINGLE_STAR",
    BINARY_STAR = "BINARY_STAR",
    MULTIPLE_STAR = "MULTIPLE_STAR"
}
export declare const PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
    13: number;
    14: number;
    15: number;
    16: number;
    17: number;
};
export declare const STAR_COUNT_DISTIBUTION_IN_SYSTEMS: {
    readonly 1: 1;
    readonly 2: 0.2;
};
export declare class SystemPhysics {
    private constructor();
}
