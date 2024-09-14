// todo remove it!
// @ts-nocheck

import { Vector3 } from 'three';

import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS, PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM } from '../CONSTANTS';
import Star from './Star';
import StarSubsystem from './StarSubsystem';
import Planet from './Planet';
import { RandomObject } from '../utils/RandomObject';
import { decimalToRoman } from '../utils';
// import Names from './Names'
import Names from './StarName';
import PlanetOrbitGenerator from './Planet/PlanetOrbitGenerator';

import { SystemType } from '../interfaces';
import { Seed } from '../utils';

interface StarGenModel {
  mass?: number;
}
interface PlanetGenModel {}

export interface SystemGenModel {
  type?: SystemType;
  seed?: Seed;
  position?: Vector3;
  stars?: StarGenModel[];
  planets?: PlanetGenModel[];

  code?: string;
  name?: string;
  habitable?: boolean;
  habitable_zone_inner?: boolean;
  habitable_zone_outer?: boolean;
  frost_line?: boolean;
  description?: string;
  celestial_objects?: any[];
}

export class System {
  type?: SystemGenModel; // SINGLE_STAR, BINARY
  code?: string;
  name?: string;
  position: Vector3;
  random?: RandomObject;

  seed?: Seed;
  seeds: { planets?: Seed; stars?: Seed } = {};
  habitable = null; // fill after planet generation
  habitable_zone_inner = null;
  habitable_zone_outer = null;
  frost_line = null;
  description = null;
  celestial_objects = [];

  stars: Star[];
  planets: any[];

  starGenerationData?: any; // todo more generic
  planetGenerationData?: any; // todo more generic

  constructor(public model: SystemGenModel = { position: new Vector3(0, 0, 0) }) {
    Object.assign(this, model); // todo remove

    const { seed, position, name, stars, planets } = model;
    this.setSeed(seed);
    this.setName(name);
    this.setPosition(position);
    // @ts-ignore
    this.stars = stars || [];
    this.planets = planets || [];
    // this.seeds = {}
    //   stars: null,
    //   planets: null,
    // return this
    // console.log(this);
  }

  setSeed(seed: number) {
    if (this.seed == null) {
      this.seed = seed || Date.now();
    }
    this.random = new RandomObject(this.seed);
    this.generateSeeds();
  }
  generateSeeds() {
    if (this.seeds && this.seeds.planets) return this.seeds;
    this.seeds = {
      stars: this.random?.next(),
      planets: this.random?.next(),
    };
  }

  setPosition(position: Vector3) {
    this.position = position || new Vector3();
  }
  setName(name?: string) {
    // this.name = name || Names.GenerateSystemName(this.random)
    this.name = name || Names.Generate(this.random);
    this.code = this.escapeRegExp(this.name as string)
      .toUpperCase()
      .replace(/ /g, '');
  }
  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, ''); // $& means the whole matched string
  }

  // async build() {
  //   // await this.generateStars()
  //   // for (let star of this.generateStars()) {}
  //   // this.stars.sort((s1, s2) => s1.mass < s2.mass)

  //   return this
  // }
  *generateStars() {
    try {
      const random = new RandomObject(this.seeds.stars);
      for (let star of System.GenerateStars(random, this)) {
        this.stars.push(star);
        this.celestial_objects.push(star);
        yield star;
      }
      // @ts-ignore
      this.stars.sort((s1, s2) => s1.mass < s2.mass);
      this.fillStarInfo();
    } catch (e) {
      console.warn(e);
    }
  }
  getStars() {
    return this.celestial_objects.filter((o) => o.type == 'STAR');
  }
  getPlanets() {
    return this.celestial_objects.filter((o) => o.type == 'PLANET');
  }
  fillPlanetInfo() {
    const planets = this.getPlanets();
    this.planetGenerationData = {
      planets_count: planets.length,
    };
    Object.assign(this, this.planetGenerationData);
  }
  fillStarInfo() {
    const stars = this.getStars();
    // this.stars_count = stars.length
    let type = null;
    switch (stars.length) {
      case 1:
        type = 'SINGLE_STAR';
        break;
      case 2:
        type = 'BINARY_STAR';
        break;
      default:
        type = 'MULTIPLE_STAR';
    }
    const star = stars[0];
    this.starGenerationData = {
      type: type,
      stars_count: stars.length,
      inner_limit: star.inner_limit,
      outer_limit: star.outer_limit,
      frost_line: star.frost_line,
      habitable_zone: star.habitable_zone,
      habitable_zone_inner: star.habitable_zone_inner,
      habitable_zone_outer: star.habitable_zone_outer,
      star_color: star.color,
    };
    Object.assign(this, this.starGenerationData);
  }
  flushStarGenerationData() {
    return this.starGenerationData;
  }
  flushPlanetGenerationData() {
    return this.planetGenerationData;
  }

  *generateProtoPlanets() {
    const random = new RandomObject(this.seeds.planets);
    const planet_count = random.weighted(PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM);
    const used_seeds = [];
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
    const habitableIndex = zones.indexOf('habitable');
    // console.log('zones', zones);
    const planetOrbits = new PlanetOrbitGenerator(this);
    for (const orbit of planetOrbits.generateOrbits()) {
      let planetSeed = random.next();
      while (used_seeds.find((o) => o == planetSeed)) planetSeed = random.next();
      used_seeds.push(planetSeed);

      const designation = `${this.name} ${decimalToRoman(orbit.from_star)}`;
      yield {
        ...orbit,
        // type: undefined,
        // subtype: orbit.type,
        seed: planetSeed,
        orbit: orbit,
        // zone: zones[i],
        // subtype: this.habitable && i === habitableIndex ? 'earth' : null,
        designation: designation,
      };
    }
    // for (let i=0; i<planet_count; i++) {
    //   // CHECK UNIQUE SEED
    //   let planetSeed = random.next()
    //   while (used_seeds.find(o => o == planetSeed)) planetSeed = random.next()
    //   used_seeds.push(planetSeed)
    //
    //   const designation = `${this.name} ${decimalToRoman(i+1)}`
    //   yield {
    //     seed: planetSeed,
    //     zone: zones[i],
    //     subtype: this.habitable && i === habitableIndex ? 'earth' : null,
    //     designation: designation,
    //   }
    // }
  }
  *generatePlanets() {
    try {
      for (let protoPlanet of this.generateProtoPlanets()) {
        // CREATE PLANET
        const planet = new Planet({
          ...protoPlanet,
          system: this,
        });
        this.planets.push(planet);
        this.celestial_objects.push(planet);
        // console.log('_planet',planet);
        yield planet;
      }
      this.fillPlanetInfo();
    } catch (e) {
      console.warn(e);
    }
  }

  Position(position) {
    this.position = position;
    return this;
  }
  Subsystem(subsystem) {
    // this._subsystem = subsystem; // todo maybe? xD
    return this;
  }

  static *GenerateStars(random, system) {
    try {
      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      // console.log('count', count, STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      if (count <= 0) return;

      for (let i = 0; i < count; i++) {
        const buildData = {
          // parent: system,
          system_sequence: undefined, // todo
          system: system,
        };
        if (count > 1) buildData.system_sequence = i;
        yield Star.Generate(random, buildData);
      }
    } catch (err) {
      console.error('ERR>', err);
    }
  }
  // static async GenerateSubsystem(random, stars) {
  //   return StarSubsystem.Generate(stars, random)
  // }
  // static async GeneratePlanets(random) {
  //
  // }
}

export default System;
