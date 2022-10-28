import { getStarColor } from "../../generators/utils/StarColor";
import { SUN_TEMPERATURE } from "../../interfaces";

export interface StarPhysicModel {
  mass: number;
  color: string;
  radius: number;
  volume: number;
  density: number;
  subtype: string;
  stellar_class: string;
  // habitable: boolean;
  evolution: boolean;
  luminosity: number;
  inner_limit: number;
  outer_limit: number;
  frost_line: number;
  temperature: number;
  surface_area: number;
  circumference: number;
  main_sequence_lifetime: number;
  habitable_zone: number;
  habitable_zone_inner: number;
  habitable_zone_outer: number;
}

export class StarPhysics {
  static calcLuminosity(mass: number) {
    switch (true) {
      case mass < 0.43:
        return 0.23 * Math.pow(mass, 2.3);
      case mass < 2 && mass >= 0.43:
        return Math.pow(mass, 4);
      case mass < 20 && mass >= 2:
        return 1.5 * Math.pow(mass, 3.5);
      case mass >= 20:
      default: // todo should be default?
        return 3200 * mass;
    }
  }
  static calcRadius(mass: number) {
    const exponent = mass > 1 ? 0.5 : 0.8;
    return Math.pow(mass, exponent);
  }
  static calcTemperature(luminosity: number, radius: number) {
    return Math.pow(luminosity / Math.pow(radius, 2), 1 / 4);
  }
  static calcColor(temperature: number) {
    const kelvins = this.solTemperatureToKelvin(temperature);
    return getStarColor(kelvins);
  }
  static calcVolume(radius: number) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
  }
  static calcDensity(mass: number, radius: number) {
    return mass / ((4 / 3) * Math.PI * Math.pow(radius, 3));
  }
  static calcFrostLine(luminosity: number) {
    return 4.85 * Math.sqrt(luminosity);
  }
  static calcMainSequenceLifetime(mass: number, luminosity: number) {
    return mass / luminosity;
  }
  static calcCircumference(radius: number) {
    return 2 * Math.PI * radius;
  }
  static calcSurfaceArea(radius: number) {
    return 4 * Math.PI * Math.pow(radius, 2);
  }
  static calcInnerLimit(mass: number) {
    let limit = 0.1 * mass;
    if (limit < 0.15) limit = 0.15;
    return limit;
  }
  static calcOuterLimit(mass: number) {
    return 40 * mass;
  }
  static calcHabitableZone(luminosity: number) {
    return Math.sqrt(luminosity);
  }
  static calcHabitableZoneStart(luminosity: number) {
    return Math.sqrt(luminosity / 1.1);
  }
  static calcHabitableZoneEnd(luminosity: number) {
    return Math.sqrt(luminosity / 0.53);
  }

  static solTemperatureToKelvin(temp = 1) {
    return temp * SUN_TEMPERATURE;
  }
}
