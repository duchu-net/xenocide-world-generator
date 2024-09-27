export type Position = {
  x: number;
  y: number;
  z: number;
}

export const galaxyClass = {
  Spiral: 'spiral',
  Grid: 'grid',
} as const;
export type GalaxyClass = typeof galaxyClass[keyof typeof galaxyClass];

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

export const CONSTELATIONS_NAMES = [
  'centauri',
  'andromeda',
  'antlia',
  'aquarius',
  'aquila',
  'ara',
  'aries',
  'auriga',
  'bootes',
  'caelum',
  'camelopardalis',
  'cancer',
  'canes venatici',
  'canis major',
  'canis minor',
  'capricornus',
  'carina',
  'cassiopeia',
  'centaurus',
  'cepheus',
  'cetus',
  'chamaeleon',
  'circinus',
  'columba',
  'coma berenices',
  'corona australis',
  'corona borealis',
  'corvus',
  'crater',
  'crux',
  'cygnus',
  'dephinus',
  'dorado',
  'draco',
  'equuleus',
  'eridanus',
  'fornax',
  'gemini',
  'grus',
  'hercules',
  'horologium',
  'hydra',
  'hydrus',
  'indus',
  'lacerta',
  'leo',
  'leo minor',
  'lepus',
  'libra',
  'lupus',
  'lynx',
  'lyra',
  'mensa',
  'microscopium',
  'monoceros',
  'musca',
  'norma',
  'octans',
  'ophiuchus',
  'orion',
  'pavo',
  'pegasus',
  'perseus',
  'phoenix',
  'pictor',
  'pisces',
  'piscis austrinus',
  'puppis',
  'pyxis',
  'reticulum',
  'sagitta',
  'sagittarius',
  'scorpius',
  'sculptor',
  'scutum',
  'serpens',
  'sextans',
  'taurus',
  'telescopium',
  'triangulum',
  'triangulum australe',
  'tucana',
  'ursa major',
  'ursa minor',
  'vela',
  'virgo',
  'volans',
  'vulpecula',
  // OLD
  'anguilla',
  'antinous',
  'apes',
  'apis',
  'aranea',
  'argo navis',
  'asselli',
  'praesepe',
  'asterion',
  'chara',
  'battery',
  'volta',
  'bufo',
  'cancer minor',
  'capra',
  'haedi',
  'cerberus',
  'corona firmiana',
  // https://en.wikipedia.org/wiki/Former_constellations
];
