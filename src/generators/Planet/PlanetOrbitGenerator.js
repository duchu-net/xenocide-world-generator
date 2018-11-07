import Random from '../../utils/RandomObject'


class Orbit {
  distance;
  zone;
  orbital_period;
  constructor(props = {}) {
    Object.assign(this, props)
    this.tags = []
    this.distance = this.cutDecimals(props.distance, 2)
  }
  cutDecimals(number, position = 2) {
    const factor = Math.pow(10, position)
    return Math.floor(number * factor) / factor
  }
  lockTag(tags) {
    if (!Array.isArray(tags)) tags = [tags]
    this.lock = true
    this.tags = tags
  }
  markAsEmpty() {
    this.lock = true
    this.tags = []
  }
  generateType(random) {
    const tags = this.tags
    if (tags.length == 0 || (tags.length == 1 && tags[0] == 'EMPTY')) {
      this.subtype = 'EMPTY'
      this.type = 'EMPTY'
      return
    }
    const weighted = []
    for (const tag of tags) {
      const orbitObject = ORBIT_OBJECT_TYPES.find(ot => ot.type == tag)
      if (!orbitObject) continue
      weighted.push([orbitObject.probability, tag])
    }
    this.subtype = random.weighted(weighted)
    this.type = ['EMPTY', 'ASTEROID_BELT'].indexOf(this.subtype) > -1 ? this.subtype : 'PLANET'
  }
  // static MOONS_TOPOLOGIES = [
  //   // { probability: 1, name: 'EMPTY' },
  //   { probability: .5, name: 'terrestial_moons', modificators: [Orbit.TerrestialMoons] }, // ['barren', 'ice']
  //   { probability: .5, name: 'terrestial_one_moon' },
  //   { probability: .5, name: 'giant_moons', modificators: [Orbit.GiantMoons] },
  //   { probability: .5, name: 'giant_habitable_moon', modificators: [Orbit.GiantMoons, Orbit.HabitableMoon] },
  // ]
  // generateMoons(random, options) {
  // //   if (this.type == 'gas_giant' && this.zone == 'habitable') {
  // //     this.moons = [
  // //       { type: 'earth' }
  // //     ]
  // //   }
  // }
  // static HabitableMoon() {}
  // static TerrestialMoons() {}
  // static GiantMoons() {}
}

class PlanetOrbitGenerator {
  static defaultProps = {}

  prefer_habitable = true // Force min 1 habitable zone orbit
  topology; // One of ['classic','hot_jupiter','habitable_moon']
  // Defaults based on Sun like star (mass(sun) = 1)
  mass = 1; // Star mass in Sun Masses
  seed;
  max_orbits;
  orbits = [];
  zones = [];
  beetwen_orbits_factor = [1.4, 2];
  // Evry value is in AU unit
  inner_limit = 0.15;
  habitable_zone_inner = 0.95;
  habitable_zone_outer = 1.37;
  frost_line = 4.85;
  outer_limit = 40;

  constructor(props = {}) {
    Object.assign(this, props)

    if (typeof props.star == 'object') this.setStar(props.star)
    if (Array.isArray(props.orbits)) this.setOrbits(props.orbits)

    if (!this.seed) this.seed = Random.randomSeed()
    if (!this.random) this.random = new Random(this.seed)
  }

  setStar(star) {
    Object.assign(this, {
      mass: star.mass,
      evolution: star.evolution,
      inner_limit: star.inner_limit,
      outer_limit: star.outer_limit,
      frost_line: star.frost_line,
      habitable_zone_inner: star.habitable_zone_inner,
      habitable_zone_outer: star.habitable_zone_outer,
    })
  }
  setOrbits(orbits) {
    this.orbits = orbits.map(orbit => new Orbit(orbit))
  }

  build() {
    this.generateTopology()
    this.generateProtoOrbits()
    this.fillOrbitZone()
    this.fillOrbitPeriod()
    // this.fillOrbitTags()
    const opts = {
      prefer_habitable: this.prefer_habitable
    }
    for (const modyficator of this._topology.modificators) modyficator(this.random, opts)(this)
    for (const orbit of this.orbits) orbit.generateType(this.random)
    this.fillInfo()
    return true
  }

  static TOPOLOGIES = [
    { probability: 1, name: 'classic', modificators: [PlanetOrbitGenerator.ClassicSystem] },
    { probability: .1, name: 'habitable_moon', modificators: [PlanetOrbitGenerator.ClassicSystem, PlanetOrbitGenerator.HabitableMoonSystem] },
    { probability: .01, name: 'hot_jupiter', modificators: [PlanetOrbitGenerator.ClassicSystem, PlanetOrbitGenerator.HotJupiterSystem] },
    { probability: .05, name: 'hot_jupiter_habitable_moon', modificators: [PlanetOrbitGenerator.ClassicSystem, PlanetOrbitGenerator.HotJupiterSystem, PlanetOrbitGenerator.HabitableMoonSystem] },
  ]
  generateTopology() {
    const topologies = PlanetOrbitGenerator.TOPOLOGIES
    if (this.topology == null) {
      this.topology = this.random.weighted(topologies.map(top => [top.probability, top.name]))
    }
    this._topology = topologies.find(top => top.name == this.topology)
    // for (const modyficator of topologyDefinition.modificators) modyficator(this.random)(this)
  }

  async generateBasics() {
    // this.generateTopology()
  }
  toJson() {
    const obj = {
      topology: this.topology,
      prefer_habitable: this.prefer_habitable,
      evolution: this.evolution,
      mass: this.mass,
      seed: this.seed,
      max_orbits: this.max_orbits,
      orbits: [...this.orbits],
      zones: this.zones,
      beetwen_orbits_factor: this.beetwen_orbits_factor,
      inner_limit: this.inner_limit,
      habitable_zone_inner: this.habitable_zone_inner,
      habitable_zone_outer: this.habitable_zone_outer,
      frost_line: this.frost_line,
      outer_limit: this.outer_limit,
    }
    console.log('not included', Object.keys(this).filter(key => Boolean(obj[key] == null)))
    return obj
  }

  fillInfo() {
    const info = {
      orbits_count: this.orbits.length,
      planets_count: this.orbits.filter(orbit => (['EMPTY', 'ASTEROID_BELT'].indexOf(orbit.type) < 0)).length,
      inner_count: this.orbits.filter(orbit => orbit.zone == 'inner').length,
      habitable_count: this.orbits.filter(orbit => orbit.zone == 'habitable').length,
      outer_count: this.orbits.filter(orbit => orbit.zone == 'outer').length,
    }
    Object.assign(this, info)
  }

  fillOrbitPeriod() {
    for (const orbit of this.orbits) {
      orbit.orbital_period = PlanetOrbitGenerator.calcOrbitalPeriod(this.mass, orbit.distance)
      orbit.orbital_period_in_days = PlanetOrbitGenerator.convertOrbitalPeriodToDays(orbit.orbital_period)
    }
  }

  fillOrbitZone() {
    for (const orbit of this.orbits) {
      switch (true) {
        case (orbit.distance > this.habitable_zone_inner && orbit.distance < this.habitable_zone_outer): orbit.zone = 'habitable'; break;
        case (orbit.distance < this.frost_line): orbit.zone = 'inner'; break;
        case (orbit.distance > this.frost_line):
        default: orbit.zone = 'outer'; break;
      }
    }
  }

  fillOrbitTags() {
    for (const orbit of this.orbits) {
      let tags = []
      for (const orbitObject of ORBIT_OBJECT_TYPES) {
        if (orbitObject.when && orbitObject.when(this, orbit)) tags.push(orbitObject.type)
      }
      orbit.tags = tags
    }
  }



  generateProtoOrbits() {
    // Get fist orbit distance
    let firstOrbitdistance = null
    if (this.prefer_habitable) { // Make sure at least one habitable will be generated
      firstOrbitdistance = this.random.real(this.habitable_zone_inner, this.habitable_zone_outer)
    } else {
      firstOrbitdistance = this.random.real(this.inner_limit, this.outer_limit)
    }
    this.orbits.push(new Orbit({ distance: firstOrbitdistance }))
    // Fill orbits down
    let lastDistance = firstOrbitdistance
    while (true) {
      const nextOrbit = lastDistance / this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1])
      if (nextOrbit < this.inner_limit) break
      this.orbits.push(new Orbit({ distance: nextOrbit }))
      lastDistance = nextOrbit
    }
    // Fill orbits up
    lastDistance = firstOrbitdistance
    while (true) {
      const nextOrbit = lastDistance * this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1])
      if (nextOrbit > this.outer_limit) break
      this.orbits.push(new Orbit({ distance: nextOrbit }))
      lastDistance = nextOrbit
    }
    // Sort by distance
    this.orbits = this.orbits.sort((a,b)=>a.distance-b.distance)
    // Fill from sun order
    for (const [index, orbit] of this.orbits.entries()) orbit.from_star = index+1
  }

  *generateOrbits() {
    if (!this.orbits.length) this.build()
    for (const orbit of this.orbits) yield orbit
  }

  // cutDecimals(number, position = 2) {
  //   const factor = Math.pow(10, position)
  //   return Math.floor(number * factor) / factor
  // }

  static calcOrbitalPeriod(star_mass, semi_major_axis) {
    return Math.sqrt(Math.pow(semi_major_axis, 3) / star_mass)
  }
  static convertOrbitalPeriodToDays(orbital_period) {
    return Math.floor(orbital_period * 365)
  }



  // static _generationStrategies = [
  //   [1, PlanetOrbitGenerator.ClassicSystem],
  //   [.1, PlanetOrbitGenerator.HabitableMoonSystem],
  //   [.05, PlanetOrbitGenerator.HotJupiterSystem]
  // ]
  static ClassicSystem(random, { prefer_habitable } = {}) {
    return (planetOrbit) => {
      // planetOrbit.topology = 'classic'
      for (const orbit of planetOrbit.orbits) {
        let tags = []
        for (const orbitObject of ORBIT_OBJECT_TYPES) {
          if (orbitObject.when && orbitObject.when(planetOrbit, orbit)) tags.push(orbitObject.type)
        }
        if (prefer_habitable && tags.indexOf('earth') > -1) {
          tags = ['earth']
        }
        orbit.tags = tags
      }
    }
  }
  // Jupiter like planet (gas giant) transfer to habitable zone from outer zone,
  // space between is cleared by giant.
  static HabitableMoonSystem(random) {
    return (planetOrbit) => {
      // planetOrbit.topology = 'habitable_moon'
      let findedHabitable = false
      let findedGasGiant = false
      for (const orbit of planetOrbit.orbits) {
        const isGiant = orbit.tags.some(tgs => tgs == 'gas_giant')
        if (orbit.zone == 'habitable' && !findedHabitable) {
          orbit.lockTag('gas_giant')
          // orbit.generateMoons(random, { min_one: ['earth'] })
          // orbit.lock = true
          // orbit.tags = ['gas_giant']
          findedHabitable = true
        } else if (findedHabitable && !findedGasGiant) {
          // orbit.tags = ['EMPTY']
          orbit.markAsEmpty()
        }
        if (isGiant) findedGasGiant = true
      }
    }
  }
  static HotJupiterSystem(random) {
    return (planetOrbit) => {
      // planetOrbit.topology = 'hot_jupiter'
      let findedGasGiant = false
      for (const [index, orbit] of planetOrbit.orbits.entries()) {
        const isGiant = orbit.tags.some(tgs => tgs == 'gas_giant')
        if (index == 0) {
          orbit.lockTag('gas_giant')
          // orbit.lock = true
          // orbit.tags = ['gas_giant']
        }
        else if (!findedGasGiant) {
          orbit.markAsEmpty()
          // orbit.tags = ['EMPTY']
        }
        if (isGiant) findedGasGiant = true
      }
    }
  }

  static async Generate(props) {
    const planetOrbit = new PlanetOrbitGenerator(props)
    // await planetOrbit.generateBasics()
    await planetOrbit.build()
    // planetOrbit.random.weighted(PlanetOrbitGenerator._generationStrategies)(planetOrbit.random)(planetOrbit)
    // PlanetOrbitGenerator.HotJupiterSystem(planetOrbit.random)(planetOrbit)
    return planetOrbit
  }
}


const ORBIT_OBJECT_TYPES = [
  { type: 'EMPTY',          probability: .05, when: (star, orbit) => true },
  { type: 'lava',           probability: .2, when: (star, orbit) => orbit.distance < star.habitable_zone_inner*0.7 },
  { type: 'barren',         probability: .1, when: (star, orbit) => orbit.distance > star.habitable_zone_inner*0.18 },
  { type: 'desert',         probability: .2, when: (star, orbit) => orbit.distance > star.habitable_zone_inner*0.7 && orbit.distance < star.frost_line },
  { type: 'ASTEROID_BELT',  probability: .2, when: (star, orbit) => orbit.distance > star.frost_line*0.1 },
  { type: 'earth',          probability: 1, when: (star, orbit) => orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer },
  { type: 'ocean',          probability: .3, when: (star, orbit) => orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line },
  { type: 'ice',            probability: .3, when: (star, orbit) => orbit.distance > star.frost_line },
  { type: 'gas_giant',      probability: .5, when: (star, orbit) => orbit.distance > star.frost_line && orbit.distance < (star.frost_line + (star.outer_limit-star.frost_line)*0.5) },
  { type: 'ice_giant',      probability: .6, when: (star, orbit) => orbit.distance > star.frost_line && orbit.distance > (star.frost_line + (star.outer_limit-star.frost_line)*0.1) },
]
const SUBORBIT_OBJECT_TYPES = [

]


export default PlanetOrbitGenerator
