import { Vector3 } from 'three';
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../interfaces';
import { RandomObject, Seed } from '../utils';
import { BasicGenerator, BasicGeneratorOptions } from './basic-generator';
import { NewStarGenerator } from './star-generator';

export enum RegionBiome {
  Ocean = 'ocean',
}

export interface RegionModel {
  id: string;
  biome: RegionBiome;
  effects: {}[];
}

export interface PlanetOptions extends BasicGeneratorOptions {
  name?: string;
  // position: Vector3;
  // temperature?: number;
  // starsSeed?: number;
  // planetsSeed?: number;
  surfaceSeed?: Seed;
}

const defaultOptions: PlanetOptions = {
  // position: new Vector3(0, 0, 0),
};

export class NewPlanetGenerator extends BasicGenerator<PlanetOptions> {
  // public readonly stars: NewStarGenerator[] = [];
  public readonly regions: RegionModel[] = [];
  // public readonly planets: any[] = [];

  // starColor?: string;
  // starRadius?: number;

  constructor(options: Partial<PlanetOptions> = defaultOptions) {
    super({ ...defaultOptions, ...options });

    if (!options.surfaceSeed) this.options.surfaceSeed = this.random.next();
  }
}
