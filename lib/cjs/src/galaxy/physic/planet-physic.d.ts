import { OrbitPhysicModel } from './orbit-physic';
import { StarPhysicModel } from './star-physic';
export interface PlanetPhysicModel {
    /** (kg) planet mass */ mass: number;
    /** (g/cm3) planet density */
    density: number;
    /** (km) planet radius */
    radius: number;
    /** (EARTH DAY) full rotation, solar day length */
    rotationPeriod: number;
    /** (axial tilt, 0-180 DEG) angle between planet rotational axis and its orbital axis */
    obliquity: number;
}
type MinMax = [min: number, max: number];
export interface PlanetClassifier {
    class: string;
    subClass: string;
    mass: MinMax;
    radius: MinMax;
    cmf?: MinMax;
    gravity?: MinMax;
    probability: number;
    color: string[];
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => boolean;
}
declare const PLANET_CLASSIFICATION: PlanetClassifier[];
export type PlanetClass = typeof PLANET_CLASSIFICATION[number]['class'];
export type PlanetSubClass = typeof PLANET_CLASSIFICATION[number]['subClass'];
export declare class PlanetPhysic {
    private constructor();
    static EARTH_RADIUS: number;
    static PLANET_MASS: MinMax;
    static PLANET_RADIUS: MinMax;
    static JUPITER_RADIUS: number;
    static JUPITER_MASS_IN_EARTH_MASS: number;
    static JUPITER_RADIUS_IN_EARTH_RADIUS: number;
    static readonly PLANET_CLASSIFICATION: PlanetClassifier[];
    /**
     * @param radius planet radius
     * @returns rotation period in EARTH DAYS // todo in hours?
     */
    static calcRotationalPeriod(mass: number, radius: number, distance: number): number;
    static calcDensity(mass: number, cmf?: number): number;
    static calcRadius(mass: number, density: number): number;
    static calcGravity(mass: number, radius: number): number;
    static getClass(planetClass: PlanetClass): PlanetClassifier;
    static getClassColor(planetClass: string): string;
}
export {};
