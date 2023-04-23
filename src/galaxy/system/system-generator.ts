import { Vector3 } from 'three';

import { codename, RandomObject } from '../../utils';

import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { StarGenerator, StarModel } from '../star';
import { PlanetGenerator, PlanetModel } from '../planet';
import { StarStellarClass, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../physic';
import { OrbitGenerator } from '../physic/orbit-generator';

import { SystemModel } from './types';
import { SystemOrbitsGenerator } from './system-orbits-generator';
import { EmptyZone, EmptyZoneModel } from './empty-zone';
import { DebrisBeltGenerator, DebrisBeltModel } from './debris-belt-generator';

type OnOrbitGenerator = PlanetGenerator | DebrisBeltGenerator | EmptyZone;

interface SystemOptions extends RandomGeneratorOptions {
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

export class SystemGenerator extends RandomGenerator<SystemModel, SystemOptions> {
  override schemaName = 'SystemModel';
  public readonly stars: StarGenerator[] = [];
  public readonly orbits: OnOrbitGenerator[] = [];
  public readonly belts: DebrisBeltGenerator[] = [];
  public readonly planets: PlanetGenerator[] = [];

  constructor(model: SystemModel, options: Partial<SystemOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.id) this.model.id = codename(this.model.name);
    if (!model.path) this.model.path = `${this.model.parentPath}/${this.model.id}`;
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
      for (const orbitGenerator of this.generateOrbits()) {
        let orbitObject: OnOrbitGenerator;
        if (orbitGenerator.model.bodyType === 'PLANET') {
          orbitObject = new PlanetGenerator(
            {
              name: PlanetGenerator.getSequentialName(this.name, nameIndex++),
              parentPath: this.model.path,
              orbit: orbitGenerator.toModel(),
            },
            { star: this.stars[0].toModel(), seed: this.random.seed() }
          );
          this.planets.push(orbitObject);
        } else if (orbitGenerator.model.bodyType === 'ASTEROID_BELT') {
          orbitObject = new DebrisBeltGenerator(
            {
              name: DebrisBeltGenerator.getSequentialName(nameIndex++),
              orbit: orbitGenerator.toModel(),
            },
            { seed: this.random.seed() }
          );
          this.belts.push(orbitObject);
        } else {
          orbitObject = new EmptyZone({
            name: EmptyZone.getSequentialName(nameIndex++),
            orbit: orbitGenerator.toModel(),
          });
        }

        this.orbits.push(orbitObject); // todo whole orbit logic should be separated, but accessible :?
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
    for (const orbit of planetOrbits.generateOrbits()) yield orbit;
  }

  override toModel(): SystemModel {
    return super.toModel({
      ...this.model,
      orbits: this.orbits.map((orbit) => orbit.toModel?.()),
      stars: this.stars.map((star) => star.toModel()),
      belts: this.belts.map((belt) => belt.toModel()),
      planets: this.planets.map((planet) => planet.toModel()),
      options: this.options,
    });
  }
}
