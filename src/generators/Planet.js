import RandomObject from '../utils/RandomObject'
import SteppedAction from '../utils/SteppedAction'
import Generator from './Generator'
import Random from '../utils/RandomObject'
import CelestialObject from './CelestialObject'
import Region from './Region'

import PlanetSurfaceGenerator from './Planet/PlanetSurfaceGenerator'
// import PlanetTerraintGenerator from './Planet/PlanetTerrainGenerator'


export class Planet extends CelestialObject {
  regions = []
  traits = []
  // type = 'PLANET'
  // habitable = null

  // body_type = 'PLANET'
  // mass = null // IN EARTH MASS
  // ORBIT
  // subtype = null
  semi_major_axis = 0 // (a) półoś wielka
  eccentricity = 0 // (e, 0-1) ekscentryczność/mimośród
  inclination = null // (i, DEG) nachylenie orbity
  longitude_of_the_ascending_node = 0 // (Ω Omega, 0-360 DEG) długość węzła wstępującego
  argument_of_periapsis = 0 // (ω, omega, 0-360 DEG)  argument perycentrum
  true_anomaly = 0 // (θ theta, 0-360 DEG) anomalia prawdziwa
  orbital_period = 0 // (P, EARTH YEAR) okres orbitalny/rok
  orbital_velocity = 0 // (Vo, EARTH SPEED) prędkość orbitalna

  constructor(props = {}) {
    super(Object.assign({}, props, props.planet || {}), 'PLANET')
    const { seed, name } = props

    // this.random = new Random(seed || Date.now())
    // this.name = name || null
  }

  async build() {
    try {
      this.createSubtype()
      this.createHabitable()
      this.createInclination()
      // console.log('...',this.subtype);
      // await this.generateName()
      // await this.generateMass()
    } catch (e) {console.warn(e)}
    return this
  }

  createInclination() {
    if (this.inclination != null) return this.inclination
    if (this.subtype != null) {
      const direction = Math.random() > .5 ? 1 : -1
      this.inclination = Math.random() > .33 ? 0 : direction * Math.floor((Math.random() * 15))
    }
    else throw { subtype: 'create planet subtype first' }
    return this.inclination
  }
  createHabitable() {
    if (this.habitable != null) return this.habitable
    const { subtype } = this
    if (subtype != null) this.habitable = (subtype == 'earth')
    else throw { subtype: 'create planet subtype first' }
    return this.habitable
  }
  createSubtype() {
    if (this.subtype != null) return this.subtype
    const { random, zone } = this
    // if (zone != null) this.subtype = Planet.createSubtypeBasedOnZone(random, zone)
    this.subtype = Planet.createSubtypeRandom(random)
    return this.subtype
  }
  // static createSubtypeBasedOnZone(random, zone) {
  //   // return 'earth'
  //   let zone_planets = null
  //   switch (zone) {
  //     case 'inner': zone_planets = { lava:1, barren:.5 }; break;
  //     case 'habitable': zone_planets = { earth:1, lava:.2, barren:.4 }; break;
  //     case 'outer': zone_planets = { ice:1, gas:1, barren:1 }; break;
  //   }
  //   return random.weighted(zone_planets)
  // }
  static createSubtypeRandom(random) {
    const zone_planets = { lava: 1, barren: 1, earth: 1, ice: 1, gas_giant: 1, ice_giant: 1 }
    return random.weighted(zone_planets)
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


  * generateProtoRegions(random, system) {
    // const surface = PlanetSurfaceGenerator.Generate(random, { details: 3 })
    for (let i=0; i<10; i++) {
      yield {
        tile: i,
      }
    }
  }
  * generateRegions() {
    try {
      const random = new Random(this.seed)
      for (let protoRegion of this.generateProtoRegions(random, this)) {
        const region = new Region({
          ...protoRegion,
          planet: this,
        })
        this.regions.push(region)
        // this.celestial_objects.push(region)
        yield region
      }
      // this.stars.sort((s1, s2) => s1.mass < s2.mass)
      // this.fillStarInfo()
    } catch (e) { console.warn(e) }
  }
}

export default Planet
