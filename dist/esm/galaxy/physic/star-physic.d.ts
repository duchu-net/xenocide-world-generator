export declare enum StarStellarClass {
    O = "O",
    B = "B",
    A = "A",
    F = "F",
    G = "G",
    K = "K",
    M = "M"
}
export interface StarPhysicModel {
    /** (SUN_MASS) star mass */
    mass: number;
    /** (hex color) star color */
    color: string;
    radius: number;
    volume: number;
    density: number;
    subtype: string;
    /** (stellar classification) classification of star based on spectral characteristics */
    stellar_class: StarStellarClass;
    /** is star capable of sustaining evolution process */
    evolution: boolean;
    /** (L, Luminosity) star luminosity - measure of the total amount of energy radiated by a star or other celestial object per second */
    luminosity: number;
    /** (Au) star inner limit - nearest orbit/planet position */
    inner_limit: number;
    /** (Au) star outer limit - farest orbit/planet position */
    outer_limit: number;
    /** (Au) frost line */
    frost_line: number;
    /** (K) star temperature in kelvins */
    temperature: number;
    surface_area: number;
    circumference: number;
    main_sequence_lifetime: number;
    habitable_zone: number;
    habitable_zone_inner: number;
    habitable_zone_outer: number;
}
export interface StarStellarClassData {
    class: StarStellarClass;
    min_sol_mass: number;
    max_sol_mass: number;
    min_kelvin_temperature: number;
    max_kelvin_temperature: number;
    organisms_evolution: boolean;
}
export declare class StarPhysics {
    private constructor();
    /** sun age in years (4603000000 YEARS) */
    static readonly SUN_AGE = 4603000000;
    /** sun temperature in kelvins (K) */
    static readonly SUN_TEMPERATURE = 5778;
    static readonly SPECTRAL_CLASSIFICATION: StarStellarClassData[];
    static readonly spectrallClasses: StarStellarClass[];
    static getSpectralByMass(mass: number): StarStellarClassData;
    static getSpectralByClass(stellarClass: string): StarStellarClassData;
    static getSpectralByTemperature(temperature: number): StarStellarClassData;
    /**
     * @param mass (SUN_MASS) star mass
     * @returns (L) luminosity
     */
    static calcLuminosity(mass: number): number;
    static calcRadius(mass: number): number;
    static calcTemperature(luminosity: number, radius: number): number;
    static calcColor(temperature: number): string;
    static calcVolume(radius: number): number;
    static calcDensity(mass: number, radius: number): number;
    static calcFrostLine(luminosity: number): number;
    static calcMainSequenceLifetime(mass: number, luminosity: number): number;
    static calcCircumference(radius: number): number;
    static calcSurfaceArea(radius: number): number;
    static calcInnerLimit(mass: number): number;
    static calcOuterLimit(mass: number): number;
    static calcHabitableZone(luminosity: number): number;
    static calcHabitableZoneStart(luminosity: number): number;
    static calcHabitableZoneEnd(luminosity: number): number;
    static solLifetimeToYears(mainSequenceLifetime: number): number;
    static solTemperatureToKelvin(temp?: number): number;
    static temperatureToColor(kelvinTemperature: number): string;
}
