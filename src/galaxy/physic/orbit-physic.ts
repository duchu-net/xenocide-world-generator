import { StarPhysicModel } from './star-physic';

export interface OrbitPhysicModel {
  /**
   * (r radius, Au) average distance from center of mass,
   * here we have perfect round orbit, so: distance = semiMajorAxis = semiMinorAxis
   */
  distance: number;
  /** (i inclination, DEG) inclination (nachylenie orbity) */
  inclination?: number;
  /** (Ω Omega, 0-360 DEG) longitude of the ascending node (długość węzła wstępującego) */
  longitude?: number;
  /** (θ theta, 0-360 DEG) true anomaly (anomalia prawdziwa) */
  anomaly?: number;
  /** (P, EARTH YEAR) orbital period (okres orbitalny/rok ziemski) */
  orbitalPeriod?: number;
  /** (x, EARTH DEYS) orbital period in days (okres orbitalny/dzień ziemski) */
  orbitalPeriodInDays?: number;
  /** sequential order from center */
  order: number;

  // todo proposal: eliptic orbits
  // semiMajorAxis?: number; // (a) półoś wielka
  // semiMinorAxis?: number; // (b) półoś mała
  // eccentricity?: number; // (e, 0-1) ekscentryczność/mimośród
  // argumentOfPeriapsis?: number; // (ω, omega, 0-360 DEG)  argument perycentrum
  // todo: not needed? position is calculated with Simulation Clock
  // orbitalVelocity?: number; // (Vo, EARTH SPEED) prędkość orbitalna
}

export enum SystemZone {
  Habitable = 'habitable',
  Inner = 'inner',
  Outer = 'outer',
}

export class OrbitPhysic {
  private constructor() {}

  static readonly EARTH_YEAR_IN_DAYS = 365;

  /**
   * @param centerMass center of mass mass
   * @param distance average distance from center of mass
   * @returns orbital period in EARTH_YEARS
   */
  static calcOrbitalPeriod(centerMass: number, distance: number) {
    return Math.sqrt(Math.pow(distance, 3) / centerMass);
  }

  /**
   * @param orbitalPeriod orbital period in EARTH_YEAR
   * @returns orbital period in EARTH_DAYS
   */
  static convertOrbitalPeriodToDays(orbitalPeriod: number) {
    return Math.floor(orbitalPeriod * this.EARTH_YEAR_IN_DAYS);
  }

  static calcZone(distance: number, physic: StarPhysicModel) {
    switch (true) {
      case distance > physic.habitable_zone_inner && distance < physic.habitable_zone_outer:
        return SystemZone.Habitable;
      case distance < physic.frost_line:
        return SystemZone.Inner;
      case distance > physic.frost_line:
      default:
        return SystemZone.Outer;
    }
  }

  static sortByDistance(mx: OrbitPhysicModel, my: OrbitPhysicModel) {
    return mx.distance - my.distance;
  }

  // todo
  // createInclination() {
  //   if (this.inclination != null) return this.inclination;
  //   if (this.subtype != null) {
  //     const direction = Math.random() > 0.5 ? 1 : -1;
  //     this.inclination = Math.random() > 0.33 ? 0 : direction * Math.floor(Math.random() * 15);
  //   } else throw { subtype: 'create planet subtype first' };
  //   return this.inclination;
  // }
}
