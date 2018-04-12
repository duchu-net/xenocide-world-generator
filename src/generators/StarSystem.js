// import Vector3 from '../utils/Vector3'
import { Vector3, Matrix4, Quaternion } from 'three'
import { STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../CONSTANTS'
import Star from './Star'
import StarSubsystem from './StarSubsystem'

class StarSystem {
  _position = null
  _stars = []

  get position() { return this._position }
  set position(pos) {
    if (!pos instanceof Vector3) throw new TypeError('position must be a Vector3 instance')
    this._position = pos
  }
  get stars() { return this._stars }
  set stars(stars) {
    if (!Array.isArray(stars)) throw new TypeError('stars must be an array')
    this._stars = stars
  }

  constructor(position, stars) {
    this.position = position || new Vector3()
    this.stars = stars || []
    // return this
    // console.log(this);
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


  static get generationStrategies() {
    return [
      // [1, Names.PlainMarkov],
      // [.1, Names.NamedStar],
    ]
  }
  static generationStrategy(random) {
    if (this._generation_strategy) return this._generation_strategy
    const gs = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
    // this._generation_strategy = gs
    return gs
  }
  static async Generate(random) {
    const stars = Array.from(StarSystem.GenerateStars(random))
      .sort((s1, s2) => s1.mass < s2.mass)
    const subsystem = await StarSystem.GenerateSubsystem(random, stars)
    console.log(subsystem);
    return new StarSystem(null, stars)
  }

  static * GenerateStars(random) {
    try {
      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
      if (count <= 0) return

      for (let i=0; i<count; i++) {
        yield Star.Generate(random)
      }
    } catch(err) {
      console.log('ERR>', err);
    }
  }
  static async GenerateSubsystem(random, stars) {
    return await StarSubsystem.Generate(stars, random)
  }
  static async GeneratePlanets(random) {

  }
}

export default StarSystem
