// import Vector3 from '../utils/Vector3'
import { Vector3, Matrix4, Quaternion } from 'three-math'
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS, PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM } from '../CONSTANTS'
import Star from './Star'
import StarSubsystem from './StarSubsystem'
import Planet from './Planet'
import Random from '../utils/RandomObject'
import { toRoman } from '../utils/alphabet'
// import Names from './Names'
import Names from './StarName'
import PlanetOrbitGenerator from './Planet/PlanetOrbitGenerator'


class System {
  type = null // SINGLE_STAR, BINARY
  code = null
  name = null
  habitable = null // fill after planet generation
  habitable_zone_inner = null
  habitable_zone_outer = null
  frost_line = null
  description = null
  celestial_objects = []

  constructor(props = {}) {
    Object.assign(this, props)
    const { seed, position, name, stars, planets } = props
    this.setSeed(seed)
    this.setName(name)
    this.setPosition(position)
    this.stars = stars || []
    this.planets = planets || []
    // this.seeds = {}
    //   stars: null,
    //   planets: null,
    // return this
    // console.log(this);
  }

  setSeed(seed) {
    if (this.seed == null) {
      this.seed = seed || Date.now()
    }
    this.random = new Random(this.seed)
    this.generateSeeds()
  }
  generateSeeds() {
    if (this.seeds && this.seeds.planets) return this.seeds
    this.seeds = {
      stars: this.random.next(),
      planets: this.random.next(),
    }
  }

  setPosition(position) {
    this.position = position || { ...(new Vector3()) }
  }
  setName(name) {
    // this.name = name || Names.GenerateSystemName(this.random)
    this.name = name || Names.Generate(this.random)
    this.code = this.escapeRegExp(this.name)
      .toUpperCase()
      .replace(/ /g, '')
  }
  escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, ''); // $& means the whole matched string
  }

  // async build() {
  //   // await this.generateStars()
  //   // for (let star of this.generateStars()) {}
  //   // this.stars.sort((s1, s2) => s1.mass < s2.mass)

  //   return this
  // }
  * generateStars() {
    try {
      const random = new Random(this.seeds.stars)
      for (let star of System.GenerateStars(random, this)) {
        this.stars.push(star)
        this.celestial_objects.push(star)
        yield star
      }
      this.stars.sort((s1, s2) => s1.mass < s2.mass)
      this.fillStarInfo()
    } catch (e) { console.warn(e) }
  }
  getStars() {
    return this.celestial_objects.filter(o => o.type == 'STAR')
  }
  getPlanets() {
    return this.celestial_objects.filter(o => o.type == 'PLANET')
  }
  fillPlanetInfo() {
    const planets = this.getPlanets()
    this.planetGenerationData = {
      planets_count: planets.length,
    }
    Object.assign(this, this.planetGenerationData)
  }
  fillStarInfo() {
    const stars = this.getStars()
    // this.stars_count = stars.length
    let type = null
    switch (stars.length) {
      case 1: type = 'SINGLE_STAR'; break;
      case 2: type = 'BINARY_STAR'; break;
      default: type = 'MULTIPLE_STAR';
    }
    const star = stars[0]
    this.starGenerationData = {
      type: type,
      stars_count: stars.length,
      inner_limit: star.inner_limit,
      outer_limit: star.outer_limit,
      frost_line: star.frost_line,
      habitable_zone: star.habitable_zone,
      habitable_zone_inner: star.habitable_zone_inner,
      habitable_zone_outer: star.habitable_zone_outer,
      star_color: star.color,
    }
    Object.assign(this, this.starGenerationData)
  }
  flushStarGenerationData() {
    return this.starGenerationData
  }
  flushPlanetGenerationData() {
    return this.planetGenerationData
  }

  * generateProtoPlanets() {
    const random = new Random(this.seeds.planets)
    const planet_count = random.weighted(PLANETS_COUNT_IN_SINGLE_STAR_SYSTEM)
    const used_seeds = []
    const zones = []
    const zonesNames = ['inner', 'habitable', 'outer']
    let maxInInner = 4
    let maxInHabitable = 3
    for (let i=0; i<planet_count; i++) {
      const tempZones = []
      if (maxInInner != 0) tempZones.push('inner')
      if (maxInHabitable != 0) tempZones.push('habitable')
      tempZones.push('outer')
      const choice = this.habitable && i==0 ? 'habitable' : random.choice(tempZones)
      // if (this.habitable && i==0)
      if (choice == 'inner') maxInInner--
      if (choice == 'habitable') maxInHabitable--
      zones.push(choice)
    }
    zones.sort((a,b) => zonesNames.indexOf(a) - zonesNames.indexOf(b))
    const habitableIndex = zones.indexOf('habitable')
    // console.log('zones', zones);
    const planetOrbits = new PlanetOrbitGenerator(this)
    for (const orbit of planetOrbits.generateOrbits()) {
      let planetSeed = random.next()
      while (used_seeds.find(o => o == planetSeed)) planetSeed = random.next()
      used_seeds.push(planetSeed)

      const designation = `${this.name} ${toRoman(orbit.from_star)}`
      yield {
        ...orbit,
        // type: undefined,
        // subtype: orbit.type,
        seed: planetSeed,
        orbit: orbit,
        // zone: zones[i],
        // subtype: this.habitable && i === habitableIndex ? 'earth' : null,
        designation: designation,
      }
    }
    // for (let i=0; i<planet_count; i++) {
    //   // CHECK UNIQUE SEED
    //   let planetSeed = random.next()
    //   while (used_seeds.find(o => o == planetSeed)) planetSeed = random.next()
    //   used_seeds.push(planetSeed)
    //
    //   const designation = `${this.name} ${toRoman(i+1)}`
    //   yield {
    //     seed: planetSeed,
    //     zone: zones[i],
    //     subtype: this.habitable && i === habitableIndex ? 'earth' : null,
    //     designation: designation,
    //   }
    // }
  }
  * generatePlanets() {
    try {
      for (let protoPlanet of this.generateProtoPlanets()) {
        // CREATE PLANET
        const planet = new Planet({
          ...protoPlanet,
          system: this,
        })
        this.planets.push(planet)
        this.celestial_objects.push(planet)
        // console.log('_planet',planet);
        yield planet
      }
      this.fillPlanetInfo()
    } catch (e) { console.warn(e) }
  }



  Position(position) {
    this.position = position
    return this
  }
  Subsystem(subsystem) {
    this._subsystem = subsystem
    return this
  }
  // Offset(offset) {
  //   this.position.add(offset)
  //   return this
  // }

  // Swirl(axis, amount) {
  //   var d = this.position.length();
  //   var angle = Math.pow(d, 0.1) * amount;
  //   this.position.applyAxisAngle(axis, angle)
  //   return this
  // }


  // static get generationStrategies() {
  //   return [
  //     // [1, Names.PlainMarkov],
  //     // [.1, Names.NamedStar],
  //   ]
  // }
  // static generationStrategy(random) {
  //   if (this._generation_strategy) return this._generation_strategy
  //   const gs = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
  //   // this._generation_strategy = gs
  //   return gs
  // }
  // static async Generate(random) {
  //   const stars = []
  //   for await (let star of System.GenerateStars(random))
  //     stars.push(star)
  //   stars.sort((s1, s2) => s1.mass < s2.mass)
  //   // console.log('stars', stars);
  //   const subsystem = await System.GenerateSubsystem(random, stars)
  //   // console.log('subsystem', subsystem, stars.length);
  //   return new System(null, stars)
  //     .Subsystem(subsystem)
  // }

  static * GenerateStars(random, system) {
    try {
      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
      // console.log('count', count, STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
      if (count <= 0) return

      for (let i=0; i<count; i++) {
        const buildData = {
          // parent: system,
          system: system,
        }
        if (count > 1) buildData.system_sequence = i
        yield Star.Generate(random, buildData)
      }
    } catch(err) {
      console.error('ERR>', err);
    }
  }
  // static async GenerateSubsystem(random, stars) {
  //   return StarSubsystem.Generate(stars, random)
  // }
  // static async GeneratePlanets(random) {
  //
  // }
}

export default System
