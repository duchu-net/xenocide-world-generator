// @todo maybe some blacklist for names? like this:
// const REAL_PLANETS_NAMES = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

import names from './names.json';

export { names };

export const getAllStarNames = () => [
  /** remove duplicates */
  ...new Set([
    ...names.real.stars,
    ...names.dune.stars,
    ...names.cosmere.stars,
    ...names.starTrek.stars,
    ...names.foundation.stars,
    ...names.honorHarrington.stars,
    /** add some planets */
    ...names.dune.planets,
    ...names.starGate.planets,
  ]),
];

export const getGalaxiesNames = () => [...names.real.galaxys];
