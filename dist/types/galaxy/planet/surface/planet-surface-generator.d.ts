import { RandomGeneratorOptions, RandomGenerator } from '../../basic-generator';
import { BiomeSurfaceModificator } from './surface-strategy/biome-surface-modificator';
import { TerrainSurfaceModificator } from './surface-strategy/terrain-surface-modificator';
import { PlanetSurface } from './surface.types';
export interface PlanetSurfaceModelGen {
}
export interface PlanetSurfaceOptions extends RandomGeneratorOptions {
    subdivisions: number;
    distortionLevel: number;
    plateCount: number;
    oceanicRate: number;
    heatLevel: number;
    moistureLevel: number;
    strategyName: string;
    byStrategy: boolean;
}
export declare const surfaceStrategy: ({
    name: string;
    modyficators: readonly [readonly [typeof TerrainSurfaceModificator, {
        readonly plateCount: 20;
        readonly oceanicRate: 0.7;
        readonly subdivisions: 9;
    }], readonly [typeof BiomeSurfaceModificator, {
        readonly strategy: "terrestial-lava";
    }]];
} | {
    name: string;
    modyficators: readonly [readonly [typeof TerrainSurfaceModificator, {
        readonly plateCount: 20;
        readonly subdivisions: 9;
    }], readonly [typeof BiomeSurfaceModificator, {
        readonly strategy: "terrestial-earth";
    }]];
} | {
    name: string;
    modyficators: readonly [readonly [typeof TerrainSurfaceModificator, {
        readonly plateCount: 7;
        readonly subdivisions: 9;
        readonly oceanicRate: 1;
        readonly moistureLevel: 1;
    }], readonly [typeof BiomeSurfaceModificator, {
        readonly strategy: "terrestial-earth";
    }]];
} | {
    name: string;
    modyficators: readonly [readonly [typeof BiomeSurfaceModificator, {
        readonly strategy: "gas-giant";
    }]];
})[];
export declare class PlanetSurfaceGenerator extends RandomGenerator<PlanetSurfaceModelGen, PlanetSurfaceOptions> {
    planet: PlanetSurface;
    constructor(model: PlanetSurfaceModelGen, options?: Partial<PlanetSurfaceOptions>);
    generateSurface(): PlanetSurface;
}
