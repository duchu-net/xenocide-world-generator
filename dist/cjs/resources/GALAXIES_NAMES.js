"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGalaxiesNames = exports.DUNE_GALAXIES_NAMES = exports.STARGATE_GALAXIES_NAMES = exports.REAL_GALAXIES_NAMES = void 0;
exports.REAL_GALAXIES_NAMES = [
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
    'Bode',
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
    'Mayall',
];
exports.STARGATE_GALAXIES_NAMES = [];
exports.DUNE_GALAXIES_NAMES = [];
const getGalaxiesNames = () => [...exports.REAL_GALAXIES_NAMES, ...exports.DUNE_GALAXIES_NAMES, ...exports.STARGATE_GALAXIES_NAMES];
exports.getGalaxiesNames = getGalaxiesNames;
