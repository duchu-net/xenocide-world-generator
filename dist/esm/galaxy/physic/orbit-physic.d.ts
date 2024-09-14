import { StarPhysicModel } from './star-physic';
export interface OrbitPhysicModel {
    /**
     * (r radius, Au) average distance from center of mass,
     * here we have perfect round orbit, so: distance = semiMajorAxis = semiMinorAxis
     */
    distance: number;
    /** (i inclination, DEG) inclination (nachylenie orbity) */
    inclination?: number;
    /** (Ω Omega, 0-360 DEG) longitude of the ascending node (długość węzła wstępującego) */
    longitude?: number;
    /** (θ theta, 0-360 DEG) true anomaly (anomalia prawdziwa) */
    anomaly?: number;
    /** (P, EARTH YEAR) orbital period (okres orbitalny/rok ziemski) */
    orbitalPeriod?: number;
    /** (x, EARTH DEYS) orbital period in days (okres orbitalny/dzień ziemski) */
    orbitalPeriodInDays?: number;
    /** sequential order from center */
    order: number;
}
export declare enum SystemZone {
    Habitable = "habitable",
    Inner = "inner",
    Outer = "outer"
}
export declare class OrbitPhysic {
    private constructor();
    static readonly EARTH_YEAR_IN_DAYS = 365;
    /**
     * @param centerMass center of mass mass
     * @param distance average distance from center of mass
     * @returns orbital period in EARTH_YEARS
     */
    static calcOrbitalPeriod(centerMass: number, distance: number): number;
    /**
     * @param orbitalPeriod orbital period in EARTH_YEAR
     * @returns orbital period in EARTH_DAYS
     */
    static convertOrbitalPeriodToDays(orbitalPeriod: number): number;
    static calcZone(distance: number, physic: StarPhysicModel): SystemZone;
    static sortByDistance(mx: OrbitPhysicModel, my: OrbitPhysicModel): number;
}
