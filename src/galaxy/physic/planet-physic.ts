import { OrbitPhysicModel } from './orbit-physic';
import { StarPhysicModel } from './star-physic';

export interface PlanetPhysicModel {
  /** (kg) planet mass */ // todo in EARTH MASS?
  mass: number;
  /** (g/cm3) planet density */
  density: number;
  /** (km) planet radius */
  radius: number;
  /** (EARTH DAY) full rotation, solar day length */
  rotationPeriod: number;
  /** (axial tilt, 0-180 DEG) angle between planet rotational axis and its orbital axis */
  obliquity: number;
}

type MinMax = [min: number, max: number];
const HABITABLE_WORLD_DENSITY: MinMax = [3, 8]; // h/cm3
const TERRAN_MASS_RANGE: MinMax = [0.1, 10];

// const GAS_MASS_RANGE: MinMax = [];

export class PlanetPhysic {
  private constructor() {}

  // static EARTH_MASS =
  // static JUPITER_MASS =
  static JUPITER_MASS_IN_EARTH_MASS = 317.83;
  static JUPITER_RADIUS_IN_EARTH_RADIUS = 11.209;

  static MIN_PLANET_MASS = 0.1;
  static MAX_PLANET_MASS = 13 * this.JUPITER_MASS_IN_EARTH_MASS;

  static readonly PLANET_CLASSIFICATION: {
    class: string;
    subClass: string;
    mass: MinMax;
    radius: MinMax;
    cmf?: MinMax;
    gravity?: MinMax;
    probability: number;
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => boolean;
  }[] = [
    {
      class: 'lava',
      subClass: 'terrestial',
      mass: [0.1, 2],
      radius: [0.5, 1.2],
      // gravity: [0.4, 1.6],
      // cmf: [0.3, 0.4],
      probability: 0.5,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner * 0.7,
    },
    {
      /* rocky planet without surface water */
      class: 'rocky',
      subClass: 'terrestial',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      gravity: [0.4, 1.6],
      cmf: [0.3, 0.4],
      probability: 0.5,
      when: () => true,
    },
    {
      /* earth like planet, with ocean and landmasses */
      class: 'terran',
      subClass: 'terrestial',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      gravity: [0.4, 1.6],
      cmf: [0.3, 0.4],
      probability: 1,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
        orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer,
    },
    {
      /* ocean planet without core, or with very small = no resources available, no advanced life */
      class: 'coreless-watery',
      subClass: 'terrestial',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
        orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
      probability: 0.1,
    },
    {
      /* ocean planet with core and islands */
      class: 'watery',
      subClass: 'terrestial',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
        orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
      probability: 0.3,
    },
    {
      class: 'icy',
      subClass: 'terrestial',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line,
      probability: 0.4,
    },
    {
      /* hot ice planet - enought big mass (and graviti) keeps ice under big pressure, don't allow melt even in 700K */
      class: 'hot-icy',
      subClass: 'terrestial',
      mass: [3, 10],
      radius: [0.5, 1.5],
      probability: 0.05,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner * 0.5,
    },
    {
      /* iron reach and big core, form close to star, where asteroid has heavy elements */
      class: 'super_mercury',
      subClass: 'terrestial',
      mass: [1, 10],
      radius: [0.5, 1.5],
      probability: 0.05,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner,
    },

    {
      class: 'puffy_giant',
      subClass: 'liquid',
      mass: [1 * this.JUPITER_MASS_IN_EARTH_MASS, 2 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [1 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 3 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.frost_line * 0.5,
      probability: 0.2,
    },
    {
      class: 'jupiter', // jupiter like
      subClass: 'liquid',
      mass: [10, 2 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [0.9 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 1.5 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
        orbit.distance > star.frost_line && orbit.distance < star.outer_limit * 0.6,
      // orbit.distance < star.frost_line + (star.outer_limit - star.frost_line) * 0.4,
      probability: 0.2,
    },
    {
      /* jupiter migrated from behind frost_line (todo: earth like planet with 2Me can be created after migration) */
      class: 'hot_jupiter',
      subClass: 'liquid',
      mass: [1 * this.JUPITER_MASS_IN_EARTH_MASS, 2 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [0.9 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 1.5 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      probability: 0.05,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > 0.04 && orbit.distance < 0.5,
    },
    {
      class: 'super_jupiter',
      subClass: 'liquid',
      mass: [2 * this.JUPITER_MASS_IN_EARTH_MASS, 13 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [0.8 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 1.2 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
        orbit.distance > star.frost_line + 1 && orbit.distance < star.frost_line + 2,
      probability: 0.5,
    },
    {
      class: 'gas_dwarf',
      subClass: 'liquid',
      mass: [1, 20],
      radius: [2, 0.8 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.outer_limit * 0.5,
      probability: 0.2,
    },

    {
      class: 'ice_giant', // neptune like, todo hot_neptune
      subClass: 'ice',
      mass: [50, 150],
      radius: [2, 1 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      probability: 0.3,
      when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line * 1.2,
    },
  ];

  /**
   * @param radius planet radius
   * @returns rotation period in EARTH DAYS // todo in hours?
   */
  static calcRotationPeriod(radius: number) {
    return 1; // not good: -0.1 + 0.069 * radius;
  }

  static calcDensity(mass: number, cmf = 0.35) {
    if (mass > 0.6) return (5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3);
    if ((5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3) > 3.5 + 4.37 * cmf)
      return (5.51 * Math.pow(mass, 0.189)) / Math.pow(1.07 - 0.21 * cmf, 3);
    return 3.5 + 4.37 * cmf;
  }

  static calcRadius(mass: number, density: number) {
    return Math.pow(mass / (density / 5.51), 1 / 3);
  }

  static calcGravity(mass: number, radius: number) {
    return Math.pow(mass / radius, 2);
  }
}
