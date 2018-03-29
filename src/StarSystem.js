import CelestialBody from './CelestialBody'

class StarSystem extends CelestialBody {
  name = null
  seed = null

  subsystems = [
    
  ]

  // constructor() {
  //   super()
  // }

  generate() {
    this.name = 'abc'
    return Promise.resolve(this)
  }
}

export default StarSystem
