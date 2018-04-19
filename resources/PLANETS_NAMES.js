export const REAL_PLANETS_NAMES = [

]

export const STARGATE_PLANETS_NAMES = [

]

export const DUNE_PLANETS_NAMES = [

]


export default [...(new Set([
  ...REAL_PLANETS_NAMES,
  ...DUNE_PLANETS_NAMES,
  ...STARGATE_PLANETS_NAMES,
]))]
