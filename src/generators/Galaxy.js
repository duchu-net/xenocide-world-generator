import StarSystem from './StarSystem'

class Galaxy {
  // generationSettings = {
  //   shape: null,
  //   planet: null,
  //   random: null,
  // }
  _star_systems = []
  _statistics = {}
  get statistics() { return this._statistics }


  constructor(starSystems) {
    // Object.assign(this.generationSettings, generationSettings)
    this._star_systems = starSystems != null ? starSystems : []
    this.fillStatistics()
  }

  fillStatistics() {
    this._statistics = {
      star_systems: this._star_systems.length,
    }
  }

  getStarSystems() {
    return this._star_systems
  }

  static async Generate(spec, random) {
    try {
      // const s = [...spec.Generate(random)]
      // const stars = spec.Generate(random)
      const s = Array.from(spec.Generate(random))
      console.log('>>>',spec, s,'<<<');
      return new Galaxy(s)
    } catch(err) {
      console.log('ERR>', err);
    }
  }
}

export default Galaxy
