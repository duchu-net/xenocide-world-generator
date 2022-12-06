import { decimalToRoman, Seed } from '../../utils';

import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { PlanetPhysic } from '../physic';
import { StarModel } from '../star';
import { SystemOrbitModel } from '../system';

import { PlanetSurfaceGenerator } from './planet-surface-generator';

export enum RegionBiome {
  Ocean = 'ocean',
}

export interface RegionModel {
  id: string;
  biome?: RegionBiome;
  effects?: {}[];
}

export interface PlanetOptions extends RandomGeneratorOptions {
  // surfaceSeed?: Seed;
  // random?: RandomObject;
  star?: StarModel;
  planetType?: string;
}
const defaultOptions: PlanetOptions = {
  // position: new Vector3(0, 0, 0),
};

export interface PlanetModel {
  id?: string;
  name?: string;
  type?: string;
  surfaceSeed?: Seed;
  physic?: PlanetPhysic;
  orbit?: SystemOrbitModel; // OrbitModel;
  regions?: RegionModel[];
  options?: {}; // todo generator options???
  schemaName?: 'PlanetModel';
}

// export interface PlanetGeneratorModel {
//   model?: PlanetModel;
//   options?: PlanetOptions;
// }

export class PlanetGenerator extends RandomGenerator<PlanetModel, PlanetOptions> {
  override schemaName = 'PlanetModel';
  public readonly regions: RegionModel[] = [];

  constructor(model: PlanetModel, options: Partial<PlanetOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.surfaceSeed) this.model.surfaceSeed = this.random.next();
    this.regions = (model.regions as RegionModel[]) || [];

    this.model.type = this.model.type || model.orbit?.subtype || options.planetType;
    // if (model.mass && !model.spectralClass) {
    //   this.meta = StarPhysics.getSpectralByMass(model.mass);
    // } else if (model.spectralClass) {
    //   this.meta = StarPhysics.getSpectralByClass(model.spectralClass);
    //   this.model.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    // } else {
    //   this.meta = this.random.choice(StarPhysics.SPECTRAL_CLASSIFICATION);
    //   this.model.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    // }
    // this.model.spectralClass = this.meta.class;

    this.recalculatePhysic();
  }

  recalculatePhysic() {
    const { type } = this.model;
    if (type) {
      
    }
    // throw new Error('Method not implemented.');
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
    return super.toModel({ regions: this.regions, options: this.options });
  }
}
