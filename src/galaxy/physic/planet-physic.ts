export interface PlanetPhysicModel {
  /** (kg) planet mass */ // todo in EARTH MASS?
  mass: number;
  /** (g/cm3) planet density */
  density: number;
  /** (km) planet radius */
  radius: number;
  /** (EARTH DAY) full rotation, solar day length */
  rotationPeriod: number;
  /** (axial tilt, DEG) angle between planet rotational axis and its orbital axis */
  obliquity: number;
}

export class PlanetPhysic {
  private constructor() {}

  /**
   * @param radius planet radius
   * @returns rotation period in EARTH DAYS // todo in hours?
   */
  static calcRotationPeriod(radius: number) {
    return 1; // not good: -0.1 + 0.069 * radius;
  }
}
