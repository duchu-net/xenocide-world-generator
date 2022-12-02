import { RandomObject } from '../../../utils';

import { PlanetSurface } from '../types';

export class SurfaceModificator<SurfaceModificatorOptions> {
  constructor(public name: string, public options: SurfaceModificatorOptions) {}

  generate(planet: PlanetSurface, random: RandomObject, options?: Partial<SurfaceModificatorOptions>) {
    throw new Error('must be ovveride');
  }
}
