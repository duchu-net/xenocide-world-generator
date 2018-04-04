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
