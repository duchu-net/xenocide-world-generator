export interface SystemPhysicModel {
  // mass: number;
  // color: string;
  // radius: number;
  // volume: number;
  // density: number;
  // subtype: string;
  // stellar_class: SystemStellarClass;
  // // habitable: boolean;
  // evolution: boolean;
  // luminosity: number;
  // inner_limit: number;
  // outer_limit: number;
  // frost_line: number;
  // temperature: number;
  // surface_area: number;
  // circumference: number;
  // main_sequence_lifetime: number;
  // habitable_zone: number;
  // habitable_zone_inner: number;
  // habitable_zone_outer: number;
}

export enum SystemType {
  SINGLE_STAR = 'SINGLE_STAR',
  BINARY_STAR = 'BINARY_STAR',
  MULTIPLE_STAR = 'MULTIPLE_STAR',
}

// SINGLE STAR
export const PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM = {
  0: 0.1,
  1: 0.1,
  2: 0.2,
  3: 0.2,
  4: 0.3,
  5: 0.3,
  6: 0.4,
  7: 0.4,
  8: 0.5,
  9: 0.5,
  10: 0.3,
  11: 0.3,
  12: 0.1,
  13: 0.1,
  14: 0.1,
  15: 0.01,
  16: 0.01,
  17: 0.001,
};

export const STAR_COUNT_DISTIBUTION_IN_SYSTEMS = {
  1: 1,
  2: 0.2,
  // 3: 0.05,
  // 4: 0.01,
  // 5: 0.005
} as const;


export class SystemPhysics {
  private constructor() {}


}