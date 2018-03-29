// const defaultsForMatrices = {
//   detail_level:     { min: 12, max: 22 },
//   distortion_level: { min: 40, max: 60 },
//   plate_count:      { min: 3, max: 20 },
//   oceanic_rate:     { min: 10, max: 90 },
//   heat_level:       { min: -50, max: 50 },
//   moisture_level:   { min: 50, max: 50 },
// }

module.exports = {
  TYPES_DISTRIBUTION: {
    ocean: 3,
    earth: 9,
    jungle: 3,
    desert: 3,
    arctic: 4,
    gas_methan: 3,
  },
  DEFAULT_MATRICE: {
    detail_level:     { min: 12, max: 22 },
    distortion_level: { min: 40, max: 60 },
    plate_count:      { min: 3, max: 20 },
    oceanic_rate:     { min: 10, max: 90 },
    heat_level:       { min: -50, max: 50 },
    moisture_level:   { min: 50, max: 50 },
  },
  PLANETS_MATRICES: [
    // JUNGLE --------------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'jungle',
      weight: 3,
      inner: false,
      habit: true,
      outer: false,
      moon: true,
      detail_level: {min: 12, max: 22}, //4-100
      distortion_level: {min: 40, max: 60}, //0-100: 0-hexagon tile, 100-different tile
      plate_count: {min: 3, max: 20}, //2-1000: continents, or islands
      oceanic_rate: {min: 10, max: 30}, //0-100: water faction
      heat_level: {min: -50, max: 50}, //-100-100: glaciel size, -100 small
      moisture_level: {min: 50, max: 100}, //-100-100: desert, or jungle
    },
    // LAVA ----------------------------------------------------------------------
  //        {
  //            type: 'lava', weight: 4,
  //            inner: true, habit: true, outer: false, moon: true
  //        },
    // DESERT --------------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'desert',
      weight: 3,
      inner: true,
      habit: true,
      outer: false,
      moon: true,
      oceanic_rate: {min: 0, max: 5},
      heat_level: {min: 50, max: 100},
      moisture_level: {min: 0, max: 50},
    },
    // BARREN --------------------------------------------------------------------
  //        {
  //            type: 'barren', weight: 6,
  //            inner: true, habit: true, outer: true, moon: true
  //        },
    // ARCTIC --------------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'arctic',
      weight: 4,
      inner: false,
      habit: false,
      outer: true,
      moon: true,
      oceanic_rate: {min: 10, max: 100},
      heat_level: {min: 0, max: 20},
      moisture_level: {min: 0, max: 20},
    },
    // OCEAN ---------------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'ocean',
      weight: 3,
      inner: false,
      habit: true,
      outer: false,
      moon: true,
      oceanic_rate: {min: 80, max: 100},
      heat_level: {min: -20, max: 20},
      moisture_level: {min: 50, max: 100},
    },
    // EARTH ---------------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'earth',
      weight: 9,
      inner: false,
      habit: true,
      outer: false,
      moon: true,
      oceanic_rate: {min: 10, max: 80},
      heat_level: {min: -20, max: 20},
      moisture_level: {min: 20, max: 70},
    },
    // GAS_METHAN ----------------------------------------------------------------
    {
      // ...defaultsForMatrices,
      type: 'gas_methan',
      weight: 3,
      inner: false,
      habit: true,
      outer: true,
      moon: false,
      oceanic_rate: {min: 0, max: 0},
      heat_level: {min: 50, max: 100},
      moisture_level: {min: -100, max: -20},
      plate_count: {min: 4, max: 9},
    },
    // GAS HELIUM ----------------------------------------------------------------
  //        {
  //            type: 'gas_hellium', weight: 3,
  //            inner: false, habit: true, outer: true, moon: false
  //        },
    // GAS_HYDROGEN --------------------------------------------------------------
  //        {
  //            type: 'gas_hydrogen', weight: 3,
  //            inner: false, habit: true, outer: true, moon: false
  //        },
  ]
}
