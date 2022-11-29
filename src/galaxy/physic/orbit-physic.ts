import { StarPhysicModel } from './star-physic';

export interface OrbitPhysicModel {
  distance: number;
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
}
