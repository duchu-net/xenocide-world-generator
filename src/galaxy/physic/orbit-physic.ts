import { StarPhysicModel } from './star-physic';

export interface OrbitPhysicModel {
  distance: number;

  // ORBIT
  semi_major_axis?: number; // (a) półoś wielka
  eccentricity?: number; // (e, 0-1) ekscentryczność/mimośród
  inclination?: number; // (i, DEG) nachylenie orbity
  longitude_of_the_ascending_node?: number; // (Ω Omega, 0-360 DEG) długość węzła wstępującego
  argument_of_periapsis?: number; // (ω, omega, 0-360 DEG)  argument perycentrum
  true_anomaly?: number; // (θ theta, 0-360 DEG) anomalia prawdziwa
  orbitalPeriod?: number; // (P, EARTH YEAR) okres orbitalny/rok
  orbital_velocity?: number; // (Vo, EARTH SPEED) prędkość orbitalna
}

export enum SystemZone {
  Habitable = 'habitable',
  Inner = 'inner',
  Outer = 'outer',
}

export class OrbitPhysic {
  static calcOrbitalPeriod(star_mass: number, semi_major_axis: number) {
    return Math.sqrt(Math.pow(semi_major_axis, 3) / star_mass);
  }
  static convertOrbitalPeriodToDays(orbitalPeriod: number) {
    return Math.floor(orbitalPeriod * 365);
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
