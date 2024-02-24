import { Vector3 } from 'three';

import { codename, RandomObject } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS, StarStellarClass, SystemPhysicModel } from '../physic';
import { OrbitGenerator } from '../physic/orbit-generator';
import { PlanetGenerator, PlanetModel } from '../planet';
import { StarGenerator, StarModel } from '../star';

import { DebrisBeltGenerator, DebrisBeltModel } from './debris-belt-generator';
import { EmptyZone, EmptyZoneModel } from './empty-zone';
import { SystemOrbitsGenerator } from './system-orbits-generator';
import { SystemModel } from './types';

type OnOrbitGenerator = PlanetGenerator | DebrisBeltGenerator | EmptyZone;

interface SystemOptions extends RandomGeneratorOptions {
  starsSeed: number;
  planetsSeed: number;
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
  seed: 0,
  starsSeed: 0,
  planetsSeed: 0,
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
  // public readonly orbits: OrbitGenerator[] = [];
  public readonly orbits: Required<SystemModel>['orbits'] = [];
  public readonly belts: DebrisBeltGenerator[] = [];
  public readonly planets: PlanetGenerator[] = [];
  public physic: SystemPhysicModel;

  constructor(model: SystemModel, options: Partial<SystemOptions> = {}) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!this.options.starsSeed) this.options.starsSeed = this.random.seed();
    if (!this.options.planetsSeed) this.options.planetsSeed = this.random.seed();
    this.physic = { ...(model.physic as SystemPhysicModel) };

    if (!model.id) this.model.id = codename(this.model.name);
    if (!model.path) this.model.path = `${this.model.parentPath}/${this.model.id}`;
    if (!model.position) this.model.position = new Vector3();
  }

  get name(): string {
    return this.model.name || 'Example System 1'; // todo
  }
  get position(): Vector3 {
    return this.model.position as Vector3;
  }

  *generateStars(): IterableIterator<StarGenerator> {
    try {
      const random = new RandomObject(this.options.starsSeed);
      const { spectralClass } = this.options;
      // console.log({spectralClass, temperature: this.model.temperature})

      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      // if (count <= 0) return;
      for (let i = 0; i < count; i++) {
        const star = new StarGenerator(
          {
            // todo when spectralClass is provided, next star should be smaller
            spectralClass: spectralClass && i === 0 ? spectralClass : undefined,
            parentPath: this.model.path,
          },
          { random }
        );
        this.stars.push(star);
        yield star;
      }

      StarGenerator.sortByMass(this.stars);
      const isSingleStar = this.stars.length === 1;
      this.stars.forEach((star, index) => (isSingleStar ? star.name(this.name) : star.name(this.name, index)));

      if (this.stars[0]) {
        this.model.starColor = this.stars[0].physic?.color;
        this.model.starRadius = this.stars[0].physic?.radius;
        // this.model.habitable = this.stars[0].physic?.habitable;
        this.physic.color = this.stars[0].physic?.color;
      }
      this.physic.starsCount = this.stars.length;
      // this.fillStarInfo(); // todo
    } catch (e) {
      console.warn('*generateStars()', e);
    }
  }

  private getStarsModels() {
    if (this.stars.length) return this.stars.map((it) => it.toModel());
    return this.model.stars || [];
  }
  *generatePlanets(): IterableIterator<OnOrbitGenerator> {
    try {
      const random = new RandomObject(this.options.planetsSeed);
      let nameIndex = 0;
      for (const orbitGenerator of this.generateOrbits()) {
        // this.orbits.push(orbitGenerator);
        const orbit = orbitGenerator.toModel();

        let bodyGenerator: OnOrbitGenerator;
        if (orbit.bodyType === 'PLANET') {
          bodyGenerator = new PlanetGenerator(
            {
              name: PlanetGenerator.getSequentialName(this.name, nameIndex++),
              parentPath: this.model.path,
              orbit,
            },
            { star: this.getStarsModels()[0], seed: random.seed() }
          );
          this.orbits.push({ bodyType: orbit.bodyType, planetPath: bodyGenerator.model.path! });
          this.planets.push(bodyGenerator);
        } else if (orbit.bodyType === 'ASTEROID_BELT') {
          bodyGenerator = new DebrisBeltGenerator(
            {
              name: DebrisBeltGenerator.getSequentialName(nameIndex++),
              parentPath: this.model.path,
              orbit,
            },
            { seed: random.seed() }
          );
          this.orbits.push({ bodyType: orbit.bodyType, beltPath: bodyGenerator.model.path! });
          this.belts.push(bodyGenerator);
        } else {
          bodyGenerator = new EmptyZone({
            name: EmptyZone.getSequentialName(nameIndex++),
            orbit,
          });
          this.orbits.push({ bodyType: 'EMPTY' });
        }

        // this.orbits.push({bodyType: orbit.bodyType, }); // todo whole orbit logic should be separated, but accessible :?
        yield bodyGenerator;
      }
      this.physic.planetsCount = this.planets.length;
      this.physic.asteroidsCount = this.belts.length;
      // this.fillPlanetInfo(); // todo
    } catch (error) {
      console.warn('*generatePlanets()', error);
    }
  }

  private *generateOrbits(): IterableIterator<OrbitGenerator> {
    const planetOrbits = new SystemOrbitsGenerator(
      {},
      // todo - when we generate from from existed system, we should use its model
      { star: this.getStarsModels()[0], seed: this.options.planetsSeed }
    );
    for (const orbit of planetOrbits.generateOrbits()) yield orbit;
  }

  override toModel(): SystemModel {
    return super.toModel({
      ...this.model,
      // orbits: this.orbits.map((orbit) => orbit.toModel?.()),
      orbits: this.orbits,
      stars: this.stars.map((star) => star.toModel()),
      belts: this.belts.map((belt) => belt.toModel()),
      planets: this.planets.map((planet) => planet.toModel()),
      physic: { ...this.physic },
      options: { ...this.options },
    });
  }
}
