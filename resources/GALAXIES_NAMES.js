export const REAL_GALAXIES_NAMES = [
  'Andromeda',
  'Black Eye',
  'Cartwheel',
  'Cigar',
  'Comet',
  'Cosmos Redshift',
  "Hoag's Object",
  'Magellanic Cloud',
  'Pinwheel',
  'Sombrero',
  'Sunflower',
  'Tadpole',
  'Whirlpool',
  'Milky Way',
  'Triangulum',
  'Centaurus A',
  "Bode",
  'Messier',
  'Canis Major',
  'Centaurus A',
  'Circinus',
  'Markarian',
  'IC',
  'NGC',
  'Cygnus A',
  'Malin',
  'Lacertae',
  'Virgo Stellar Stream',
  'Baby Boom',
  'Boötes Dwarf',
  'WISE',
  'Segue',
  'Mice',
  'Sagittarius',
  'Omega Centauri',
  'Mayall'
]

export const STARGATE_GALAXIES_NAMES = [

]

export const DUNE_GALAXIES_NAMES = [
 
]


export default [...(new Set([
  ...REAL_GALAXIES_NAMES,
  ...DUNE_GALAXIES_NAMES,
  ...STARGATE_GALAXIES_NAMES,
]))]
