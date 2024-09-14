import { Vector3 } from 'three';
import { RandomObject } from '../../../../utils';
import { PlanetSurface, Topology } from '../surface.types';
import { Border, Corner, Plate, Tile } from '../utils';
import { SurfaceModificator } from './surface-modificator';
interface ElevetionBorderTask {
    origin: {
        corner: Corner;
        pressure: number;
        shear: number;
        plate: Plate;
        calculateElevation: (distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number) => number;
    };
    border: Border;
    corner: Corner;
    nextCorner: Corner;
    distanceToPlateBoundary: number;
}
interface PlanetTerrainGeneratorOptions {
    plateCount: number;
    oceanicRate: number;
    heatLevel: number;
    moistureLevel: number;
}
export declare class TerrainSurfaceModificator extends SurfaceModificator<PlanetTerrainGeneratorOptions> {
    constructor(options?: Partial<PlanetTerrainGeneratorOptions>);
    generate(planet: PlanetSurface, random: RandomObject, options?: Partial<PlanetTerrainGeneratorOptions>): void;
    generatePlanetTectonicPlates(topology: Topology, plateCount: number, oceanicRate: number, random: RandomObject): Plate[];
    calculateCornerDistancesToPlateRoot(plates: Plate[]): void;
    generatePlanetElevation(topology: Topology, plates: Plate[]): void;
    identifyBoundaryBorders(borders: Border[]): void;
    collectBoundaryCorners(corners: Corner[]): Corner[];
    calculatePlateBoundaryStress(boundaryCorners: Corner[]): (number | null)[];
    calculateStress(movement0: Vector3, movement1: Vector3, boundaryVector: Vector3, boundaryNormal: Vector3): {
        pressure: number;
        shear: number;
    };
    blurPlateBoundaryStress(boundaryCorners: Corner[], stressBlurIterations: number, stressBlurCenterWeighting: number): void;
    populateElevationBorderQueue(boundaryCorners: Corner[], boundaryCornerInnerBorderIndexes: (number | null)[]): ElevetionBorderTask[];
    calculateCollidingElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    calculateSubductingElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    calculateSuperductingElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    calculateDivergingElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    calculateShearingElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    calculateDormantElevation(distanceToPlateBoundary: number, distanceToPlateRoot: number, boundaryElevation: number, plateElevation: number, pressure: number, shear: number): number;
    processElevationBorderQueue(elevationBorderQueue: ElevetionBorderTask[], elevationBorderQueueSorter: (task1: ElevetionBorderTask, task2: ElevetionBorderTask) => number): void;
    calculateTileAverageElevations(tiles: Tile[]): void;
}
export {};
