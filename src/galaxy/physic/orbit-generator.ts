import { RandomObject } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';

import { OrbitPhysicModel, SystemZone } from './orbit-physic';
import { StarPhysicModel } from './star-physic';

enum SystemBodyType {
  EMPTY = 'EMPTY',
  PLANET = 'PLANET',
  ASTEROID_BELT = 'ASTEROID_BELT',
}
// enum PlanetType {
//   lava = 'lava',
//   barren = 'barren',
//   desert = 'desert',
//   earth = 'earth',
//   ocean = 'ocean',
//   ice = 'ice',
//   ice_giant = 'ice_giant',
//   gas_giant = 'gas_giant',
//   EMPTY = 'EMPTY',
// }

export interface OrbitModel extends OrbitPhysicModel {
  schemaName?: 'orbit-model';
  /** zone in system */
  zone?: SystemZone;
  /** orbiting body type */
  bodyType?: SystemBodyType;
  // /** planet type */
  // subtype?: PlanetType;
}

interface OrbitOptions extends RandomGeneratorOptions {
  maxInclinationDeg: number;
}

const defaultOptions = {
  maxInclinationDeg: 15,
};

const denormalize = (normalized: number, min: number, max: number) => normalized * (max - min) + min;
const normalize = (value: number, min: number, max: number) => (value - min) / (max - min);

export class OrbitGenerator extends RandomGenerator<OrbitModel, OrbitOptions> {
  override schemaName = 'orbit-model';

  protected tags: string[] = [];
  protected lock: boolean = false;

  constructor(model: OrbitModel, options: Partial<OrbitOptions> = {}) {
    super(model, { ...defaultOptions, ...options });
    // this.distance = this.cutDecimals(props.distance, 2);
    this.generateOrbit();
  }

  generateOrbit() {
    const { maxInclinationDeg } = this.options;
    const pow = 3;
    const temp1 = 15;
    // todo near orbit has orbit inclination closer to 0
    // const temp1 = Math.pow(this.model.distance, pow);

    const random = this.random.integer(-temp1, temp1);
    let inclination = normalize(Math.pow(random, pow), Math.pow(-temp1, pow), Math.pow(temp1, pow));
    inclination = denormalize(inclination, -maxInclinationDeg, maxInclinationDeg);

    this.updateModel('inclination', inclination);
    this.updateModel('longitude', this.random.integer(-180, 180));
    this.updateModel('anomaly', this.random.integer(-180, 180));
  }

  setTags(tags: string[]) {
    this.tags = tags;
  }
  hasTag(tagName: string) {
    return this.tags.includes(tagName);
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
      this.updateModel('bodyType', SystemBodyType.EMPTY);
      // this.updateModel('subtype', PlanetType.EMPTY);
      return;
    }
    const weighted: [number, string][] = [];
    for (const tag of tags) {
      const orbitObject = ORBIT_OBJECT_TYPES.find((ot) => ot.type == tag);
      if (!orbitObject) continue;
      weighted.push([orbitObject.probability, tag]);
    }
    const bodyType = random.weighted(weighted);
    // const subtype = random.weighted(weighted);
    // this.updateModel('subtype', subtype);
    // const type = ['EMPTY', 'ASTEROID_BELT'].includes(subtype) ? subtype : 'PLANET';
    this.updateModel('bodyType', bodyType);
  }

  // cutDecimals(number: number, position = 2) {
  //   const factor = Math.pow(10, position);
  //   return Math.floor(number * factor) / factor;
  // }

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

export const ORBIT_OBJECT_TYPES: {
  type: OrbitModel['bodyType'];
  probability: number;
  when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => boolean;
}[] = [
  { type: SystemBodyType.EMPTY, probability: 0.05, when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => true },
  // {
  //   type: PlanetType.lava,
  //   probability: 0.2,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner * 0.7,
  // },
  // {
  //   type: PlanetType.barren,
  //   probability: 0.1,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.habitable_zone_inner * 0.18,
  // },
  // {
  //   type: PlanetType.desert,
  //   probability: 0.2,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
  //     orbit.distance > star.habitable_zone_inner * 0.7 && orbit.distance < star.frost_line,
  // },
  {
    type: SystemBodyType.ASTEROID_BELT,
    probability: 0.2,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line * 0.1,
  },
  {
    type: SystemBodyType.PLANET,
    probability: 1,
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => true,
  },
  // {
  //   type: PlanetType.earth,
  //   probability: 1,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
  //     orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer,
  // },
  // {
  //   type: PlanetType.ocean,
  //   probability: 0.3,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
  //     orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
  // },
  // {
  //   type: PlanetType.ice,
  //   probability: 0.3,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line,
  // },
  // {
  //   type: PlanetType.gas_giant,
  //   probability: 0.5,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
  //     orbit.distance > star.frost_line && orbit.distance < star.frost_line + (star.outer_limit - star.frost_line) * 0.5,
  // },
  // {
  //   type: PlanetType.ice_giant,
  //   probability: 0.6,
  //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
  //     orbit.distance > star.frost_line && orbit.distance > star.frost_line + (star.outer_limit - star.frost_line) * 0.1,
  // },
];
