import { Vector3 } from 'three';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { OrbitPhysicModel, StarStellarClass, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from './physic';
import { PlanetGenerator } from './planet-generator';
import { StarGenerator } from './star-generator';
import { SurfaceStrategies, SurfaceStrategy } from './strategy';

export interface PlanetSurfaceModel {
  options?: {};
}

export interface PlanetSurfaceOptions extends BasicGeneratorOptions {
  // prefer_habitable: boolean;
  // planetsCount?: number; // todo
  // spectralClass?: StarStellarClass;
}

const defaultOptions: PlanetSurfaceOptions = {
  // prefer_habitable: true,
};

export class PlanetSurfaceGenerator extends ExtendedGenerator<PlanetSurfaceModel, PlanetSurfaceOptions> {
  // public readonly model: PlanetGenerator;
  public readonly strategy: SurfaceStrategy;

  constructor(
    public readonly planet: PlanetGenerator,
    options: Partial<PlanetSurfaceOptions> = defaultOptions
  ) {
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
