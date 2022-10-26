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

// export 
export enum SystemType {
  SINGLE_STAR = 'SINGLE_STAR',
  BINARY_STAR = 'BINARY_STAR',
  MULTIPLE_STAR = 'MULTIPLE_STAR',
}

export enum StarClass {
  O='O',
  B='B',
  A='A',
  F='F',
  G='G',
  K='K',
  M='M',
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