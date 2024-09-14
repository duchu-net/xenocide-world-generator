import { Vector3 } from 'three';
import { RandomObject } from '../../../../utils';
import { Corner, Tile } from '../utils';
import { PlanetSurface } from '../surface.types';
interface Whorl {
    center: Vector3;
    strength: number;
    radius: number;
}
export declare class PlanetWeatherGenerator {
    generatePlanetWeather(topology: PlanetSurface['topology'], partitions: PlanetSurface['partition'], heatLevel: number, moistureLevel: number, random: RandomObject): void;
    generateAirCurrentWhorls(planetRadius: number, random: RandomObject): Whorl[];
    calculateAirCurrents(corners: Corner[], whorls: Whorl[], planetRadius: number): void;
    initializeAirHeat(corners: Corner[], heatLevel: number): {
        corners: Corner[];
        airHeat: number;
    };
    processAirHeat(activeCorners: Corner[]): number;
    calculateTemperature(corners: Corner[], tiles: Tile[], planetRadius: number): void;
    initializeAirMoisture(corners: Corner[], moistureLevel: number): {
        corners: Corner[];
        airMoisture: number;
    };
    processAirMoisture(activeCorners: Corner[]): number;
    calculateMoisture(corners: Corner[], tiles: Tile[]): void;
}
export {};
