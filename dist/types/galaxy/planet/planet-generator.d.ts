import { Seed } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { PlanetPhysicModel } from '../physic';
import { StarModel } from '../star';
import { PlanetModel, RegionModel } from './planet-generator.model';
export interface PlanetOptions extends RandomGeneratorOptions {
    seed: Seed;
    surfaceSeed: Seed;
    star?: StarModel;
    planetType?: string;
}
export declare class PlanetGenerator extends RandomGenerator<PlanetModel, PlanetOptions> {
    schemaName: string;
    regions: RegionModel[];
    private meta;
    physic: PlanetPhysicModel;
    constructor(model: PlanetModel, options?: Partial<PlanetOptions>);
    initializePhysic(): void;
    get subtype(): string;
    generateSurface(): Generator<RegionModel, void, unknown>;
    static getSequentialName(systemName: string, planetIndex: number): string;
    toModel(): PlanetModel;
}
