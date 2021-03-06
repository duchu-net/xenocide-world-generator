import CelestialBody from './CelestialBody'

class Planet extends CelestialBody {
  name = null
  seed = null
  mass = null
  from_star = null

  // ORBIT
  semi_major_axis = 0 // (a) półoś wielka
  eccentricity = 0 // (e, 0-1) ekscentryczność/mimośród
  inclination = 0 // (i, DEG) nachylenie orbity
  longitude_of_the_ascending_node = 0 // (Ω Omega, 0-360 DEG) długość węzła wstępującego
  argument_of_periapsis = 0 // (ω, omega, 0-360 DEG)  argument perycentrum
  true_anomaly = 0 // (θ theta, 0-360 DEG) anomalia prawdziwa
  orbital_period = 0 // (P, EARTH YEAR) okres orbitalny/rok
  orbital_velocity = 0 // (Vo, EARTH SPEED) prędkość orbitalna

  // constructor() {
  //   super()
  // }

  generate(args = {}) {
    const {
      seed,
      name,
    } = args

    this.seed = seed || this.randomSeed()
    this.name = name || this.randomName()
    return Promise.resolve(this)
  }

  randomName() {
    return 'abc'
  }

  randomSeed() {
    return 'abc123'
  }

  // BASED ON EARTH MASS
  generateMass() {

  }
}

export default Planet
