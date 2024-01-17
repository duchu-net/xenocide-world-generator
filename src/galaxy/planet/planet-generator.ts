import { codename, decimalToRoman, Seed } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { OrbitPhysicModel, PlanetClassifier, PlanetPhysic, PlanetPhysicModel, StarPhysicModel } from '../physic';
import { OrbitModel } from '../physic/orbit-generator';
import { StarModel } from '../star';

import { PlanetSurfaceGenerator } from './surface/planet-surface-generator';
import { PlanetModel, RegionModel } from './planet-generator.model';

export interface PlanetOptions extends RandomGeneratorOptions {
  seed: Seed;
  surfaceSeed: Seed;
  // random?: RandomObject;
  star?: StarModel;
  planetType?: string;
}
const defaultOptions: PlanetOptions = {
  seed: 0,
  surfaceSeed: 0,
  // position: new Vector3(0, 0, 0),
};

// export interface PlanetGeneratorModel {
//   model?: PlanetModel;
//   options?: PlanetOptions;
// }

export class PlanetGenerator extends RandomGenerator<PlanetModel, PlanetOptions> {
  override schemaName = 'PlanetModel';
  public regions: RegionModel[];
  private meta: PlanetClassifier;
  public physic: PlanetPhysicModel = {
    mass: 0,
    density: 0,
    radius: 0,
    rotationPeriod: 0,
    obliquity: 0,
  };

  constructor(model: PlanetModel, options: Partial<PlanetOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!this.options.surfaceSeed) this.options.surfaceSeed = this.random.seed();

    if (!model.id) this.model.id = codename(this.model.name);
    if (!model.path) this.model.path = `${this.model.parentPath}/p:${this.model.id}`;
    this.regions = (model.regions as RegionModel[]) || [];

    const type = model.type || options.planetType;
    if (type) {
      this.meta = PlanetPhysic.getClass(type);
    } else {
      const availableClasses = PlanetPhysic.PLANET_CLASSIFICATION.filter((planetTopology) =>
        planetTopology.when(this.options.star?.physic as StarPhysicModel, this.model.orbit as OrbitPhysicModel)
      );
      this.meta = this.random.weighted(availableClasses.map((top) => [top.probability, top])) as PlanetClassifier;
    }

    this.model.type = this.meta.class as PlanetModel['type'];
    this.model.subType = this.meta.subClass as PlanetModel['subType'];
    this.model.radius = this.model.radius || this.random.real(this.meta.radius[0], this.meta.radius[1]);

    // this.generateTopology();
    this.initializePhysic();
  }

  initializePhysic() {
    const { model, physic, options } = this;
    // Object.assign(physic, options.orbit);
    physic.radius = model.radius || physic.radius;

    // physic.mass = model.mass || physic.mass;
    physic.mass = 1;
    physic.rotationPeriod = PlanetPhysic.calcRotationalPeriod(physic.mass, physic.radius, model.orbit?.distance || 1);
  }

  get subtype(): string {
    // @ts-ignore
    return this.model.subtype;
  }

  *generateSurface() {
    try {
      const surface = new PlanetSurfaceGenerator({}, { strategyName: this.model.type, seed: this.options.surfaceSeed });
      surface.generateSurface();
      this.regions = surface.planet.topology.tiles.map((tile) => ({
        id: tile.id.toString(),
        path: `${this.model.path}/r:${tile.id.toString()}`,
        biome: tile.biome as RegionModel['biome'],
        color: tile.color ? `#${tile.color.getHexString()}` : this.meta.color[0],
        corners: tile.corners.map((corner) => corner.position),
        neighbors: tile.tiles.map((tile) => tile.id.toString()),
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
    return super.toModel({
      ...this.model,
      regions: this.regions,
      physic: { ...this.physic },
      options: { ...options },
    });
  }
}
