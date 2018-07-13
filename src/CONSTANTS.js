export const PLANETARY_SYSTEMS_TYPES = {
  SINGLE_STAR: 'SINGLE_STAR',
  BINARY_P_TYPE_STAR: 'BINARY_P_TYPE_STAR',
  // MULTIPLE_BINARY_S_TYPE_STAR: 'MULTIPLE_BINARY_S_TYPE_STAR',
  MULTIPLE_S_TYPE_STAR: 'MULTIPLE_S_TYPE_STAR'
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
}
// 2 STARS RELATIVELY CLOSE
export const PLANETS_COUNT_IN_BINARY_STAR_P_TYPE_SYSTEM = PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM
// 2 STARS FAR AWAY
export const PLANETS_COUNT_IN_BINARY_STAR_S_TYPE_SYSTEM = {
 0: 1,
 1: 0.5,
 2: 0.1,
 3: 0.01,
 4: 0.001,
 5: 0.0001,
}
//
// export const PLANETS_COUNT_IN_BINARY_SYSTEMS = {
//
// }

export const MIN_STARS_MASS_DIFFERENCE_IN_SYSTEM = 0.1
export const STAR_COUNT_DISTIBUTION_IN_BINARY_SUBSYSTEMS = {
  1: 0.2,
  2: 1 // WE WANT MORE CHANCE FOR BINARY P TYPE STARS
}
export const STAR_COUNT_DISTIBUTION_IN_SYSTEMS = {
  1: 1,
  2: 0.2,
  // 3: 0.05,
  // 4: 0.01,
  // 5: 0.005
}

export const SUN_AGE = 4.603e9 // 4603000000 YEARS
export const SUN_TEMPERATURE = 5778 // (K)
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
]
