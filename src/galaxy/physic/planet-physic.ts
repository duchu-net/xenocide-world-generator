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

export class PlanetPhysic {
  private constructor() {}

  // static EARTH_MASS =
  // static JUPITER_MASS =
  static JUPITER_MASS_IN_EARTH_MASS = 317.83;
  static JUPITER_RADIUS_IN_EARTH_RADIUS = 11.209;
  static readonly PLANET_CLASSIFICATION = [
    {
      type: 'rocky',
      mass: [0.1, 10],
      radius: [0.5, 1.5],
      gravity: [0.4, 1.6],
      cmf: [0.3, 0.4],
    },
    {
      type: 'watery',
    },
    {
      type: 'super_mercury',
    },
    {
      type: 'jupiter',
      mass: [10, 2 * this.JUPITER_MASS_IN_EARTH_MASS],
    },
    {
      type: 'gas_dwarf',
      radius: [2, 0.8 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
      mass: [1, 20],
    },
    {
      type: 'super_jupiter',
      mass: [2 * this.JUPITER_MASS_IN_EARTH_MASS, 13 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [0.8 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 1.2 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
    },
    {
      type: 'puffy_giant',
      mass: [1 * this.JUPITER_MASS_IN_EARTH_MASS, 2 * this.JUPITER_MASS_IN_EARTH_MASS],
      radius: [1 * this.JUPITER_RADIUS_IN_EARTH_RADIUS, 3 * this.JUPITER_RADIUS_IN_EARTH_RADIUS],
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
