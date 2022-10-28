import { Vector3 } from 'three';
import { PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../interfaces';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions } from './basic-generator';
import { OrbitPhysicModel } from './physic';
import { NewPlanetGenerator } from './planet-generator';
import { NewStarGenerator } from './star-generator';
import { SystemOrbitsGenerator } from './system-orbits-generator';

export interface NewSystemGeneratorOptions extends BasicGeneratorOptions {
  name?: string;
  position: Vector3;
  temperature?: number;
  starsSeed?: number;
  planetsSeed?: number;
}

const defaultOptions: NewSystemGeneratorOptions = {
  position: new Vector3(0, 0, 0),
};

enum GenerationStep {
  INIT = 'init',
  BASIC = 'basic',
  STARS = 'stars',
  PLANETS = 'planets',
  FINISHED = 'finished',
}

export class NewSystemGenerator extends BasicGenerator<NewSystemGeneratorOptions> {
  public readonly stars: NewStarGenerator[] = [];
  public readonly orbits: (NewPlanetGenerator | OrbitPhysicModel)[] = [];

  habitable?: boolean;
  starColor?: string;
  starRadius?: number;

  constructor(options: Partial<NewSystemGeneratorOptions> = defaultOptions) {
    super({ ...defaultOptions, ...options });

    if (!options.starsSeed) this.options.starsSeed = this.random.next();
    if (!options.planetsSeed) this.options.planetsSeed = this.random.next();
  }

  get name(): string {
    return this.options.name || 'ab_1'; // todo
  }
  get position(): Vector3 {
    return this.options.position;
  }

  *generateStars() {
    try {
      const random = new RandomObject(this.options.starsSeed);

      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      if (count <= 0) return;
      for (let i = 0; i < count; i++) {
        const star = new NewStarGenerator({ random, name: NewStarGenerator.getName(this.name, i) });
        this.stars.push(star);
        yield star;
      }

      this.stars.sort((s1, s2) => s1.mass - s2.mass);
      if (this.stars[0]) {
        this.starColor = this.stars[0].physic?.color;
        this.starRadius = this.stars[0].physic?.radius;
        this.habitable = this.stars[0].physic?.habitable;
      }
      // this.fillStarInfo(); // todo
    } catch (e) {
      console.warn('*generateStars()', e);
    }
  }

  *generatePlanets() {
    try {
      for (const protoPlanet of this.generateProtoPlanets()) {
        let orbitObject: NewPlanetGenerator | OrbitPhysicModel;
        if (protoPlanet.type === 'PLANET')
          orbitObject = new NewPlanetGenerator({
            ...protoPlanet,
            // system: this,
          });
        else orbitObject = protoPlanet;
        // this.planets.push(planet);
        this.orbits.push(orbitObject);
        yield orbitObject;
      }
      // this.fillPlanetInfo(); // todo
    } catch (error) {
      console.warn('*generatePlanets()', error);
    }
    console.log({ system: this });
  }

  *generateProtoPlanets() {
    const random = new RandomObject(this.options.planetsSeed);
    const planet_count = random.weighted(PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM);
    const used_seeds: number[] = [];
    const zones = [];
    const zonesNames = ['inner', 'habitable', 'outer'];
    let maxInInner = 4;
    let maxInHabitable = 3;
    for (let i = 0; i < planet_count; i++) {
      const tempZones = [];
      if (maxInInner != 0) tempZones.push('inner');
      if (maxInHabitable != 0) tempZones.push('habitable');
      tempZones.push('outer');
      const choice = this.habitable && i == 0 ? 'habitable' : random.choice(tempZones);
      // if (this.habitable && i==0)
      if (choice == 'inner') maxInInner--;
      if (choice == 'habitable') maxInHabitable--;
      zones.push(choice);
    }
    zones.sort((a, b) => zonesNames.indexOf(a) - zonesNames.indexOf(b));
    // const habitableIndex = zones.indexOf('habitable');
    // console.log('zones', zones);
    const planetOrbits = new SystemOrbitsGenerator({ star: this.stars[0] });
    for (const orbit of planetOrbits.generateOrbits()) {
      let planetSeed = random.next();
      while (used_seeds.find((o) => o == planetSeed)) planetSeed = random.next();
      used_seeds.push(planetSeed);

      // const designation = `${this.name} ${toRoman(orbit.from_star)}`; // todo
      const designation = `${this.name} ${orbit.from_star}`;
      yield {
        ...orbit,
        // type: undefined,
        // subtype: orbit.type,
        seed: planetSeed,
        // orbit: orbit,
        // zone: zones[i],
        // subtype: this.habitable && i === habitableIndex ? 'earth' : null,
        designation: designation,
      };
    }
  }
}
