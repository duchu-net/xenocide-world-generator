import RandomObject from '../utils/RandomObject'
import SteppedAction from '../utils/SteppedAction'
import Generator from './Generator'
import Random from '../utils/RandomObject'
import CelestialObject from './CelestialObject'


class Planet extends CelestialObject {
  // type = 'PLANET'
  habitable = null

  // body_type = 'PLANET'
  // mass = null // IN EARTH MASS
  // ORBIT
  semi_major_axis = 0 // (a) półoś wielka
  eccentricity = 0 // (e, 0-1) ekscentryczność/mimośród
  inclination = 0 // (i, DEG) nachylenie
  longitude_of_the_ascending_node = 0 // (Ω Omega, 0-360 DEG) długość węzła wstępującego
  argument_of_periapsis = 0 // (ω, omega, 0-360 DEG)  argument perycentrum
  true_anomaly = 0 // (θ theta, 0-360 DEG) anomalia prawdziwa
  orbital_period = 0 // (P, EARTH YEAR) okres orbitalny/rok
  orbital_velocity = 0 // (Vo, EARTH SPEED) prędkość orbitalna

  constructor(props = {}) {
    super(props, 'PLANET')
    const { seed, name } = props

    this.random = new Random(seed || Date.now())
    // this.name = name || null
  }

  async build() {
    // await this.generateName()
    await this.generateMass()
    return this
  }
  // async generateName() {
  //   const name = 'abc'
  //   if (!this.name) this.name = name
  //   return name
  // }
  async generateMass(force = false) {
    const mass = 1
    if (!this.mass || force) this.mass = mass
    return mass
  }
}

export default Planet
