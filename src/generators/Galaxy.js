import StarSystem from './StarSystem'
import Random from '../utils/RandomObject'
import Names from './Names'
import Grid from './Galaxies/Grid'
import PlanetarySystem from './PlanetarySystem'


class Galaxy {
  // generationSettings = {
  //   shape: null,
  //   planet: null,
  //   random: null,
  // }
  _star_systems = []
  // _statistics = {}
  get statistics() {
    if (this._statistics == null) this.fillStatistics()
    return this._statistics
  }
  get star_systems() { return this._star_systems }
  set star_systems(ss = []) { this._star_systems = ss }
  get seed() { return this._seed }
  set seed(seed) { this._seed = seed }

  constructor(seed) {
    this.seed = seed
    this.random = new Random(seed)
    // Object.assign(this.generationSettings, generationSettings)
    // this.star_systems = starSystems // != null ? starSystems : []
    // this.fillStatistics()
  }



  fillStatistics() {
    this._statistics = {
      star_systems: this.star_systems.length,
    }
  }

  getStarSystems() {
    return this.star_systems
  }

  GenerateUniqNames() {
    // return Names.Generate
    const random = new Random()
    // return Array(this.star_systems.length).map(() => Names.Generate(random))
    this.star_systems.forEach(ss => ss.name = Names.Generate(random))
    return this
  }
  GenerateStars(shape) {
    const protoStars = [...shape.Generate(this.random)]
    this.star_systems = protoStars.map(ps => new StarSystem('123', ps))
    return this
  }

  GenerateSystems(systems) {
    // const protoStars = [...shape.Generate(this.random)]
    this.star_systems = systems.map(ps => new PlanetarySystem('123', ps))
    return this
  }

  static async Generate(spec, random) {
    try {
      if (spec == null) spec = new Grid(15, 10)
      if (random == null) random = new Random()
      const shape = Array.from(spec.GenerateShape(random))
      // const s = [...spec.Generate(random)]
      // const stars = spec.Generate(random)
      // const systems = Array.from(spec.Generate(random))
      // console.log('>>>',spec, systems,'<<<');
      return new Galaxy('seed')
        .GenerateSystems(shape)
        .GenerateUniqNames()
    } catch(err) {
      console.error('ERR>', err);
    }
  }
}

export default Galaxy
