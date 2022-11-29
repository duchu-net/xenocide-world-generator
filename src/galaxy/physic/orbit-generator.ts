import { RandomObject } from '../../utils';
import { OrbitPhysicModel } from './orbit-physic';
import { StarPhysicModel } from './star-physic';

export interface OrbitModel {
  distance: number;
  zone?: string;
  orbitalPeriod?: number;

  type?: string;
  subtype?: string;

  fromStar?: number;
  orbitalPeriodInDays?: number;
}

export class OrbitGenerator {
  type?: string;
  subtype?: string;
  distance: number;
  zone?: string;
  orbitalPeriod?: number;
  tags: string[] = [];
  lock: boolean = false;

  fromStar?: number; // todo move to system?
  orbitalPeriodInDays?: number;

  constructor(props: OrbitModel) {
    this.zone = props.zone;
    this.orbitalPeriod = props.orbitalPeriod;

    this.distance = this.cutDecimals(props.distance, 2);
  }

  toJSON() {
    return this.toModel();
  }
  toModel() {
    return {
      type: this.type,
      subtype: this.subtype,
      distance: this.distance,
      orbitalPeriod: this.orbitalPeriod,
    };
  }

  cutDecimals(number: number, position = 2) {
    const factor = Math.pow(10, position);
    return Math.floor(number * factor) / factor;
  }
  lockTag(tags: OrbitGenerator['tags'] | OrbitGenerator['tags'][0]) {
    if (!Array.isArray(tags)) tags = [tags];
    this.lock = true;
    this.tags = tags;
  }
  markAsEmpty() {
    this.lock = true;
    this.tags = [];
  }
  generateType(random: RandomObject) {
    const tags = this.tags;
    if (tags.length == 0 || (tags.length == 1 && tags[0] == 'EMPTY')) {
      this.subtype = 'EMPTY';
      this.type = 'EMPTY';
      return;
    }
    const weighted = [];
    for (const tag of tags) {
      const orbitObject = ORBIT_OBJECT_TYPES.find((ot) => ot.type == tag);
      if (!orbitObject) continue;
      weighted.push([orbitObject.probability, tag]);
    }
    const subtype = random.weighted(weighted);
    this.subtype = subtype;
    this.type = ['EMPTY', 'ASTEROID_BELT'].indexOf(subtype) > -1 ? this.subtype : 'PLANET';
  }
  // static MOONS_TOPOLOGIES = [
  //   // { probability: 1, name: 'EMPTY' },
  //   { probability: .5, name: 'terrestial_moons', modificators: [Orbit.TerrestialMoons] }, // ['barren', 'ice']
  //   { probability: .5, name: 'terrestial_one_moon' },
  //   { probability: .5, name: 'giant_moons', modificators: [Orbit.GiantMoons] },
  //   { probability: .5, name: 'giant_habitable_moon', modificators: [Orbit.GiantMoons, Orbit.HabitableMoon] },
  // ]
  // generateMoons(random, options) {
  // //   if (this.type == 'gas_giant' && this.zone == 'habitable') {
  // //     this.moons = [
  // //       { type: 'earth' }
  // //     ]
  // //   }
  // }
  // static HabitableMoon() {}
  // static TerrestialMoons() {}
  // static GiantMoons() {}
}

export const ORBIT_OBJECT_TYPES = [
  { type: 'EMPTY', probability: 0.05, when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => true },
  {
    type: 'lava',
    probability: 0.2,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner * 0.7,
  },
  {
    type: 'barren',
    probability: 0.1,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.habitable_zone_inner * 0.18,
  },
  {
    type: 'desert',
    probability: 0.2,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
      orbit.distance > star.habitable_zone_inner * 0.7 && orbit.distance < star.frost_line,
  },
  {
    type: 'ASTEROID_BELT',
    probability: 0.2,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line * 0.1,
  },
  {
    type: 'earth',
    probability: 1,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
      orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer,
  },
  {
    type: 'ocean',
    probability: 0.3,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
      orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
  },
  {
    type: 'ice',
    probability: 0.3,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line,
  },
  {
    type: 'gas_giant',
    probability: 0.5,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
      orbit.distance > star.frost_line && orbit.distance < star.frost_line + (star.outer_limit - star.frost_line) * 0.5,
  },
  {
    type: 'ice_giant',
    probability: 0.6,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
      orbit.distance > star.frost_line && orbit.distance > star.frost_line + (star.outer_limit - star.frost_line) * 0.1,
  },
] as const;
