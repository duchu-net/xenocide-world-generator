import { RandomObject } from '../../../../utils';
import { PlanetSurface } from '../surface.types';
export declare class SurfaceModificator<SurfaceModificatorOptions> {
    name: string;
    options: SurfaceModificatorOptions;
    constructor(name: string, options: SurfaceModificatorOptions);
    generate(planet: PlanetSurface, random: RandomObject, options?: Partial<SurfaceModificatorOptions>): void;
}
