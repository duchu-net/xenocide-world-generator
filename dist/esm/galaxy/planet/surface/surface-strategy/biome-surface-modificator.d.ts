import { RandomObject } from '../../../../utils';
import { PlanetSurface } from '../surface.types';
import { Tile } from '../utils';
import { SurfaceModificator } from './surface-modificator';
interface BiomeStrategy {
    name: string;
    generateBiomes: (tiles: Tile[], planetRadius: number, random: RandomObject) => void;
}
interface PlanetBiomeGeneratorOptions {
    strategy: string;
}
export declare class BiomeSurfaceModificator extends SurfaceModificator<PlanetBiomeGeneratorOptions> {
    strategy: BiomeStrategy;
    constructor(options?: Partial<PlanetBiomeGeneratorOptions>);
    generate(planet: PlanetSurface, random: RandomObject, options?: Partial<PlanetBiomeGeneratorOptions>): void;
}
export {};
