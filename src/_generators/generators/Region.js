import RandomObject from '../../utils/RandomObject'
import SteppedAction from '../../utils/SteppedAction'
// import Generator from './Generator'
// import {
//   SPECTRAL_CLASSIFICATION,
//   SUN_TEMPERATURE,
//   SUN_AGE,
//  } from '../CONSTANTS'


class Region {
  type = 'REGION'
  subtype = null
  // seq_id = null

  tile = null // Tile sequential id
  neighbors = []
  planet = null // Planet Object

  physics = {
    biome: null,
    elevation: null,
    moisture: null,
    temperature: null,
  }

  constructor({ physics, ...props } = {}) {
    Object.assign(this, props)
    if (physics != null) this.setPhysics(physics)
  }

  setPhysics(physics) {
    for (const key of Object.keys(this.physics)) {
      if (physics[key] !== undefined) this.physics[key] = physics[key]
    }
  }

  toObject() {
    return {
      type: this.type,
      subtype: this.subtype,
      tile: this.tile,
      neighbors: [...this.neighbors],
      physics: {...this.physics},
    }
  }
}

export default Region
