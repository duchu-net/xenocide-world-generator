// import Vector3 from '../utils/Vector3'
import { Vector3, Matrix4, Quaternion } from 'three-math'
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../CONSTANTS'
import Star from './Star'
import StarSubsystem from './StarSubsystem'
import Planet from './Planet'
import Random from '../utils/RandomObject'
import Names from './Names'


class StarSystem {
  type = null // SINGLE_STAR, BINARY
  code = null
  habitable_zone_inner = null
  habitable_zone_outer = null
  frost_line = null
  description = null
  celestial_objects = []

  constructor({ seed, position, name, stars, planets } = {}) {
    this.setSeed(seed)
    this.setName(name)
    this.setPosition(position)
    this.stars = stars || []
    this.planets = planets || []
    this.seeds = {}
    //   stars: null,
    //   planets: null,
    // return this
    // console.log(this);
  }

  setSeed(seed) {
    this.seed = seed || Date.now()
    this.random = new Random(this.seed)
    this.generateSeeds()
  }
  generateSeeds() {
    this.seeds = {
      stars: this.random.next(),
      planets: this.random.next(),
    }
  }

  setPosition(position) {
    this.position = position || { ...(new Vector3()) }
  }
  setName(name) {
    this.name = name || Names.Generate(this.random)
    this.code = this.name.toUpperCase()
  }

  async build() {
    // await this.generateStars()
    // for (let star of this.generateStars()) {}
    // this.stars.sort((s1, s2) => s1.mass < s2.mass)

    return this
  }
  * generateStars() {
    try {
      for (let star of StarSystem.GenerateStars(this.random, this)) {
        this.stars.push(star)
        this.celestial_objects.push(star)
        yield star
      }
      this.stars.sort((s1, s2) => s1.mass < s2.mass)
    } catch (e) { console.warn(e) }
  }
  * generatePlanets() {
    try {
      const { random } = this
      const planet_count = 5
      for (let i=0; i<planet_count; i++) {
        // CHECK UNIQUE SEED
        let planetSeed = random.next()
        while (this.planets.find(o => o.seed == planetSeed)) planetSeed = random.next()
        // CREATE PLANET
        const planet = new Planet({
          seed: planetSeed,
          name: `planet_${i+1}`,
          designation: `${this.name} ${i+1}`,
          system: this,
        })
        this.planets.push(planet)
        this.celestial_objects.push(planet)
        // console.log('_planet',planet);
        yield planet
      }
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
  Offset(offset) {
    this.position.add(offset)
    return this
  }

  Swirl(axis, amount) {
    var d = this.position.length();
    var angle = Math.pow(d, 0.1) * amount;
    this.position.applyAxisAngle(axis, angle)
    return this
  }


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
  //   for await (let star of StarSystem.GenerateStars(random))
  //     stars.push(star)
  //   stars.sort((s1, s2) => s1.mass < s2.mass)
  //   // console.log('stars', stars);
  //   const subsystem = await StarSystem.GenerateSubsystem(random, stars)
  //   // console.log('subsystem', subsystem, stars.length);
  //   return new StarSystem(null, stars)
  //     .Subsystem(subsystem)
  // }

  static * GenerateStars(random, system) {
    try {
      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
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

export default StarSystem
