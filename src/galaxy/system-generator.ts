import { Vector3 } from 'three';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { DebrisBeltGenerator } from './debris-belt-generator';
import { OrbitPhysicModel, StarStellarClass, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from './physic';
import { PlanetGenerator } from './planet-generator';
import { StarGenerator, StarModel } from './star-generator';
import { SystemOrbitsGenerator } from './system-orbits-generator';

type CelestialModel = PlanetGenerator | DebrisBeltGenerator | OrbitPhysicModel;

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
  orbits?: CelestialModel[];
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
  public readonly stars: StarGenerator[] = [];
  public readonly orbits: CelestialModel[] = [];

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

  *generatePlanets(): IterableIterator<CelestialModel> {
    try {
      let planetIndex = 0;
      let otherIndex = 0;
      for (const protoPlanet of this.generateProtoPlanets()) {
        let orbitObject: CelestialModel;
        if (protoPlanet.type === 'PLANET')
          orbitObject = new PlanetGenerator({
            name: PlanetGenerator.getSequentialName(this.name, planetIndex++),
            orbit: protoPlanet,
          });
        else if (protoPlanet.type === 'ASTEROID_BELT') {
          orbitObject = new DebrisBeltGenerator({
            name: DebrisBeltGenerator.getSequentialName(otherIndex++),
            orbit: protoPlanet,
          });
        } else orbitObject = { ...protoPlanet, name: `${protoPlanet.type} ${++otherIndex}` };

        this.orbits.push(orbitObject);
        yield orbitObject;
      }
      // this.fillPlanetInfo(); // todo
    } catch (error) {
      console.warn('*generatePlanets()', error);
    }
  }

  *generateProtoPlanets() {
    const random = new RandomObject(this.model.planetsSeed);
    // const planet_count = random.weighted(PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM);
    // const used_seeds: number[] = [];
    // const zones = [];
    // const zonesNames = ['inner', 'habitable', 'outer'];
    // let maxInInner = 4;
    // let maxInHabitable = 3;
    // for (let i = 0; i < planet_count; i++) {
    //   const tempZones = [];
    //   if (maxInInner != 0) tempZones.push('inner');
    //   if (maxInHabitable != 0) tempZones.push('habitable');
    //   tempZones.push('outer');
    //   const choice = this.options.prefer_habitable && i == 0 ? 'habitable' : random.choice(tempZones);
    //   // if (this.habitable && i==0)
    //   if (choice == 'inner') maxInInner--;
    //   if (choice == 'habitable') maxInHabitable--;
    //   zones.push(choice);
    // }
    // zones.sort((a, b) => zonesNames.indexOf(a) - zonesNames.indexOf(b));

    const planetOrbits = new SystemOrbitsGenerator({ star: this.stars[0], random });
    for (const orbit of planetOrbits.generateOrbits()) {
      // let planetSeed = random.next();
      // while (used_seeds.find((o) => o == planetSeed)) planetSeed = random.next();
      // used_seeds.push(planetSeed);

      // // const designation = `${this.name} ${toRoman(orbit.from_star)}`; // todo
      // const designation = `${this.name} ${orbit.from_star}`;
      // yield {
      //   ...orbit,
      //   // type: undefined,
      //   // subtype: orbit.type,
      //   seed: planetSeed,
      //   // orbit: orbit,
      //   // zone: zones[i],
      //   // subtype: this.habitable && i === habitableIndex ? 'earth' : null,
      //   designation: designation,
      // };
      yield orbit;
    }
  }

  override toModel(): SystemModel {
    return {
      ...this.model,
      stars: this.stars.map((star) => star.toModel()),
      // @ts-ignore
      orbits: this.orbits.map((orbit) => orbit.toModel?.()),
      options: this.options,
    };
  }
}
