import CelestialBody from './CelestialBody'

class Star extends CelestialBody {
  name = null
  sequence_type = null
  mass = 0 // masa
  temperature = 0 // (K)
  luminosity = 0 // jasność
  radius = 0 // promień
  volume = 0 // objętość
  main_sequence_lifetime = 0
  density = 0 // gęstość


  // constructor() {
  //   super()
  // }

  generate() {
    this.name = 'abc'
    return Promise.resolve(this)
  }
}

export default Star
