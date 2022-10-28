interface CelestialPhysic {
  mass?: number;
  radius?: number;
}

export interface StarPhysic extends CelestialPhysic {
  diameter?: number;
  temperature?: number;
  volume?: number;
  density?: number;
  circumference?: number;
  surface_area?: number;

  stellar_class?: string;
  main_sequence_lifetime?: number;
  luminosity?: number;
  frost_line?: number;
}

export interface PlanetPhysic extends CelestialPhysic {
  // mass?: number;
}

export interface MoonPhysic extends CelestialPhysic {
  // mass?: number;
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

export enum GalaxyClass {
  Spiral = 'spiral',
  Grid = 'grid',
}

export enum GalaxyAge {
  Young = 'young',
  Mature = 'mature',
  Acient = 'ancient',
}

export enum GalaxyClassShape {
  Elliptical = 'elliptical',
  Spiral2 = 'spiral-2',
  Spiral3 = 'spiral-3',
  Spiral4 = 'spiral-4',
  Cluster = 'cluster',
  Disc = 'disc',
  Box = 'box',
  Irregular = 'irregular',
  Ring = 'ring',
}

export enum StarClass {
  O = 'O',
  B = 'B',
  A = 'A',
  F = 'F',
  G = 'G',
  K = 'K',
  M = 'M',
}

export const SPECTRAL_CLASSIFICATION = [
  {
    class: 'O',
    min_sol_mass: 16,
    max_sol_mass: 50,
    organisms_evolution: false,
  },
  {
    class: 'B',
    min_sol_mass: 2.1,
    max_sol_mass: 16,
    organisms_evolution: false,
  },
  {
    class: 'A',
    min_sol_mass: 1.4,
    max_sol_mass: 2.1,
    organisms_evolution: false,
  },
  {
    class: 'F',
    min_sol_mass: 1.04,
    max_sol_mass: 1.4,
    organisms_evolution: true,
  },
  {
    class: 'G',
    min_sol_mass: 0.8,
    max_sol_mass: 1.04,
    organisms_evolution: true,
  },
  {
    class: 'K',
    min_sol_mass: 0.45,
    max_sol_mass: 0.8,
    organisms_evolution: true,
  },
  {
    class: 'M',
    min_sol_mass: 0.08,
    max_sol_mass: 0.45,
    organisms_evolution: false,
  },
  // TODO BROWN DWARF
  // {
  //   class: 'BD',
  //   min_sol_mass: 0.013,
  //   max_sol_mass: 0.08,
  //   organisms_evolution: false,
  //   iluminosity: false,
  // }
];
