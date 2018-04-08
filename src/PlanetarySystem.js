import weighted from './utils/weighted-random'
import {
  STAR_COUNT_DISTIBUTION_IN_SYSTEMS,
} from './CONSTANTS'

class PlanetSystem {
  name = null
  system = [
    // { type: 'star' },
    // { type: 'planet' },
    // { type: 'planet' },
    // { type: 'planet' },
  ]
  stars_number = null

  constructor() {

  }

  generate() {
    return Promise.resolve()
      .then(() => {

      })
  }

  generateType() {

  }

  generateSystem() {
    // const stars_count = Math.random()
    return weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
  }
}

export default PlanetSystem

// system = [
//   'star',
//   ['star', 'planet', 'planet'],
//   'planet',
//   'planet',
// ]
