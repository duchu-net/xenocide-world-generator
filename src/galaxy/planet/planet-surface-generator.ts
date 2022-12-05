import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';

import { PlanetGenerator } from './planet-generator';
import { SurfaceStrategies, SurfaceStrategy } from './strategy';

export interface PlanetSurfaceModel {
  options?: {};
}

export interface PlanetSurfaceOptions extends RandomGeneratorOptions {
  // prefer_habitable: boolean;
}

const defaultOptions: PlanetSurfaceOptions = {
  // prefer_habitable: true,
};

export class PlanetSurfaceGenerator extends RandomGenerator<PlanetSurfaceModel, PlanetSurfaceOptions> {
  public readonly strategy: SurfaceStrategy;

  constructor(public readonly planet: PlanetGenerator, options: Partial<PlanetSurfaceOptions> = defaultOptions) {
    super(planet, { ...defaultOptions, ...planet.options, ...options });

    this.strategy = SurfaceStrategies[planet.subtype] || SurfaceStrategies['barren'];
  }

  *generateSurface() {
    // @ts-ignore
    this.strategy.doAlgorithm(this.planet.regions);
    for (let i = 0; i < this.planet.regions.length; i++) {
      yield this.planet.regions[i];
    }
  }

  override toModel() {
    return {
      ...this.planet,
      // stars: this.stars.map((star) => star.toModel()),
      // // @ts-ignore
      // orbits: this.orbits.map((orbit) => orbit.toModel?.()),
      // options: this.options,
    };
  }
}
