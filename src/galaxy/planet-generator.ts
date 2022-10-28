import { decimalToRoman, RandomObject, Seed } from '../utils';
import { BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';

export enum RegionBiome {
  Ocean = 'ocean',
}

export interface RegionModel {
  id: string;
  biome?: RegionBiome;
  effects?: {}[];
}

export interface PlanetOptions extends BasicGeneratorOptions {
  // surfaceSeed?: Seed;
  random?: RandomObject;
}
const defaultOptions: PlanetOptions = {
  // position: new Vector3(0, 0, 0),
};

export interface PlanetModel {
  id?: string;
  name?: string;
  surfaceSeed?: Seed;
  physic?: {
    mass?: number;
  };
  orbit?: {}; // OrbitModel;
  regions?: RegionModel[];
  options?: {}; // todo generator options???
}

// export interface PlanetGeneratorModel {
//   model?: PlanetModel;
//   options?: PlanetOptions;
// }

export class PlanetGenerator extends ExtendedGenerator<PlanetModel, PlanetOptions> {
  public readonly regions: RegionModel[] = [];

  constructor(model: PlanetModel, options: Partial<PlanetOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.surfaceSeed) this.model.surfaceSeed = this.random.next();
    this.regions = (model.regions as RegionModel[]) || [];
  }

  *generateSurface() {
    try {
      // todo
      for (let i = 0; i < 5; i++) {
        const region = { id: `demo_region ${i}` };
        this.regions.push(region);
        yield region;
      }
    } catch (error) {
      console.warn('*generateSurface()', error);
    }
  }

  static getSequentialName(systemName: string, planetIndex: number) {
    return `${systemName} ${decimalToRoman(planetIndex + 1)}`;
  }

  override toModel() {
    return { ...this.model, regions: this.regions, options: this.options };
  }
}
