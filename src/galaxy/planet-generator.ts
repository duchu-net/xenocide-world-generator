import { decimalToRoman, RandomObject, Seed } from '../utils';
import { BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { PlanetSurfaceGenerator } from './planet-surface-generator';
import { SystemOrbitModel } from './system-orbits-generator';

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
  orbit?: SystemOrbitModel; // OrbitModel;
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

  get subtype(): string {
    // @ts-ignore
    return this.model.orbit.subtype;
  }

  *generateSurface() {
    try {
      for (let i = 0; i < 5; i++) {
        const region = { id: `demo_region ${i}` };
        this.regions.push(region);
      }

      // todo
      const surface = new PlanetSurfaceGenerator(this);
      for (const region of surface.generateSurface()) {
        yield region;
      }

      // for (let i = 0; i < 5; i++) {
      //   yield this.regions[i];
      // }
    } catch (error) {
      console.warn('*generateSurface()', error);
    }
  }

  static getSequentialName(systemName: string, planetIndex: number) {
    return `${systemName} ${decimalToRoman(planetIndex + 1)}`;
  }

  override toModel(): PlanetModel {
    return { ...this.model, regions: this.regions, options: this.options };
  }
}
