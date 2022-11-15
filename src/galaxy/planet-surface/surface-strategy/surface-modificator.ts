import { PlanetSurface } from '../utils';
import { RandomObject } from '../../../utils';

export class SurfaceModificator<SurfaceModificatorOptions> {
  constructor(public name: string, public options: SurfaceModificatorOptions) {}

  generate(planet: PlanetSurface, random: RandomObject, options?: Partial<SurfaceModificatorOptions>) {
    throw new Error('must be ovveride');
  }
}
