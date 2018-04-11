import CelestialBody from './CelestialBody'
import {
  SPECTRAL_CLASSIFICATION,
  SUN_TEMPERATURE,
  SUN_AGE,
} from './CONSTANTS'


class BinaryStar extends CelestialBody {
  body_type = 'binary_star'

  stars = []

  generate(args = {}) {
    const { name } = args

    return Promise.resolve()
      .then(() => this)
  }
}

export default BinaryStar
