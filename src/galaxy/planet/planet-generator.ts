import { Vector3 } from 'three';

import { decimalToRoman, Seed } from '../../utils';

import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { OrbitPhysicModel, PlanetClassifier, PlanetPhysic } from '../physic';
import { StarModel } from '../star';
import { SystemOrbitModel } from '../system';

import { PlanetSurfaceGenerator } from './surface/planet-surface-generator';

export enum RegionBiome {
  Ocean = 'ocean',
}

export interface RegionModel {
  id: string;
  biome?: RegionBiome;
  corners: Vector3[];
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
  // type?: string;
  radius?: number;
  surfaceSeed?: Seed;
  physic?: PlanetPhysic;
  orbit?: SystemOrbitModel; // OrbitModel;
  regions?: RegionModel[];
  options?: {}; // todo generator options???

  type?:
    | 'lava'
    | 'rocky'
    | 'terran'
    | 'coreless-watery'
    | 'watery'
    | 'icy'
    | 'hot_icy'
    | 'super_mercury'
    | 'puffy_giant'
    | 'jupiter'
    | 'hot_jupiter'
    | 'super_jupiter'
    | 'gas_dwarf'
    | 'ice_giant';
  subType?: 'terrestial' | 'liquid' | 'ice';
  schemaName?: 'PlanetModel';
}

// export interface PlanetGeneratorModel {
//   model?: PlanetModel;
//   options?: PlanetOptions;
// }

export class PlanetGenerator extends RandomGenerator<PlanetModel, PlanetOptions> {
  override schemaName = 'PlanetModel';
  public regions: RegionModel[];
  private meta: PlanetClassifier;

  constructor(model: PlanetModel, options: Partial<PlanetOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.surfaceSeed) this.model.surfaceSeed = this.random.next();
    this.regions = (model.regions as RegionModel[]) || [];

    const type = model.type || options.planetType;
    if (type) {
      this.meta = PlanetPhysic.getClass(type);
    } else {
      const availableClasses = PlanetPhysic.PLANET_CLASSIFICATION.filter((planetTopology) =>
        planetTopology.when(this.options.star?.physic, this.model.orbit as OrbitPhysicModel)
      );
      this.meta = this.random.weighted(availableClasses.map((top) => [top.probability, top])) as PlanetClassifier;
    }

    this.model.type = this.meta.class as PlanetModel['type'];
    this.model.subType = this.meta.subClass as PlanetModel['subType'];
    this.model.radius = this.model.radius || this.random.real(this.meta.radius[0], this.meta.radius[1]);

    // this.generateTopology();
    this.recalculatePhysic();
  }

  recalculatePhysic() {
    // const { type } = this.model;
    // if (type) {
    // }
    // throw new Error('Method not implemented.');
  }

  get subtype(): string {
    // @ts-ignore
    return this.model.orbit.subtype;
  }

  *generateSurface() {
    try {
      const surface = new PlanetSurfaceGenerator({}, { strategyName: this.model.type });
      surface.generateSurface();
      this.regions = surface.planet.topology.tiles.map((tile) => ({
        id: tile.id.toString(),
        biome: tile.biome as RegionModel['biome'],
        color: tile.color && `#${tile.color.getHexString()}`,
        corners: tile.corners.map((corner) => corner.position),
      }));
      // for (const region of surface.generateSurface()) {
      //   yield region;
      // }

      for (let index = 0; index < this.regions.length; index++) {
        yield this.regions[index];
      }
    } catch (error) {
      console.warn('*generateSurface()', error);
    }
  }

  static getSequentialName(systemName: string, planetIndex: number) {
    return `${systemName} ${decimalToRoman(planetIndex + 1)}`;
  }

  override toModel(): PlanetModel {
    const { star, ...options } = this.options;
    return super.toModel({ regions: this.regions, options });
  }
}
