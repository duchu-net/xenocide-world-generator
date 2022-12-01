import { Vector3 } from 'three';
import { PlanetModel } from '.';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { DebrisBeltGenerator, DebrisBeltModel } from './debris-belt-generator';
import { OrbitPhysicModel, StarStellarClass, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from './physic';
import { OrbitGenerator, OrbitModel } from './physic/orbit-generator';
import { PlanetGenerator } from './planet-generator';
import { StarGenerator, StarModel } from './star-generator';
import { SystemOrbitModel, SystemOrbitsGenerator } from './system-orbits-generator';
import { EmptyZone, EmptyZoneModel } from './system/empty-zone';

type OnOrbitGenerator = PlanetGenerator | DebrisBeltGenerator | EmptyZone;

export interface SystemModel {
  starColor?: string;
  habitable?: boolean;
  starRadius?: number;
  name?: string;
  position?: Vector3;
  temperature?: number;
  starsSeed?: number;
  planetsSeed?: number;

  stars?: StarModel[];
  orbits?: (PlanetModel | DebrisBeltModel | EmptyZoneModel)[];
  options?: {};
}

export interface SystemOptions extends BasicGeneratorOptions {
  // name?: string;
  // position: Vector3;
  // temperature?: number;
  // starsSeed?: number;
  // planetsSeed?: number;
  prefer_habitable: boolean;
  planetsCount?: number; // todo
  spectralClass?: StarStellarClass;
}

const defaultOptions: SystemOptions = {
  // position: new Vector3(0, 0, 0),
  prefer_habitable: true,
};

// enum GenerationStep {
//   INIT = 'init',
//   BASIC = 'basic',
//   STARS = 'stars',
//   PLANETS = 'planets',
//   FINISHED = 'finished',
// }

export class SystemGenerator extends ExtendedGenerator<SystemModel, SystemOptions> {
  override schemaName = 'SystemModel';
  public readonly stars: StarGenerator[] = [];
  public readonly orbits: OnOrbitGenerator[] = [];

  constructor(model: SystemModel, options: Partial<SystemOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.position) this.model.position = new Vector3();
    if (!model.starsSeed) this.model.starsSeed = this.random.next();
    if (!model.planetsSeed) this.model.planetsSeed = this.random.next();
  }

  get name(): string {
    return this.model.name || 'ab_1'; // todo
  }
  get position(): Vector3 {
    return this.model.position as Vector3;
  }

  *generateStars(): IterableIterator<StarGenerator> {
    try {
      const { spectralClass } = this.options;
      // console.log({spectralClass, temperature: this.model.temperature})
      const random = new RandomObject(this.model.starsSeed);

      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      // if (count <= 0) return;
      for (let i = 0; i < count; i++) {
        // todo when spectralClass is provided, next star should be smaller
        const star = new StarGenerator(spectralClass && i === 0 ? { spectralClass } : {}, { random });
        this.stars.push(star);
        yield star;
      }

      StarGenerator.sortByMass(this.stars);
      this.stars.forEach((star, index, arr) =>
        star.setName(arr.length === 1 ? this.name : StarGenerator.getSequentialName(this.name, index))
      );

      if (this.stars[0]) {
        this.model.starColor = this.stars[0].physic?.color;
        this.model.starRadius = this.stars[0].physic?.radius;
        // this.model.habitable = this.stars[0].physic?.habitable;
      }
      // this.fillStarInfo(); // todo
    } catch (e) {
      console.warn('*generateStars()', e);
    }
  }

  *generatePlanets(): IterableIterator<OnOrbitGenerator> {
    try {
      let nameIndex = 0;
      for (const orbitModel of this.generateOrbits()) {
        let orbitObject: OnOrbitGenerator;
        if (orbitModel.type === 'PLANET')
          orbitObject = new PlanetGenerator({
            name: PlanetGenerator.getSequentialName(this.name, nameIndex++),
            orbit: orbitModel.toModel(),
          });
        else if (orbitModel.type === 'ASTEROID_BELT') {
          orbitObject = new DebrisBeltGenerator({
            name: DebrisBeltGenerator.getSequentialName(nameIndex++),
            orbit: orbitModel.toModel(),
          });
        } else {
          orbitObject = new EmptyZone({
            name: EmptyZone.getSequentialName(nameIndex++),
            orbit: orbitModel.toModel(),
          });
        }

        this.orbits.push(orbitObject);
        yield orbitObject;
      }
      // this.fillPlanetInfo(); // todo
    } catch (error) {
      console.warn('*generatePlanets()', error);
    }
  }

  *generateOrbits(): IterableIterator<OrbitGenerator> {
    const random = new RandomObject(this.model.planetsSeed);

    const planetOrbits = new SystemOrbitsGenerator({}, { star: this.stars[0], random });

    for (const orbit of planetOrbits.generateOrbits()) {
      yield orbit;
    }
  }

  override toModel(): SystemModel {
    return super.toModel({
      stars: this.stars.map((star) => star.toModel()),
      orbits: this.orbits.map((orbit) => orbit.toModel?.()),
      options: this.options,
    });
  }
}
