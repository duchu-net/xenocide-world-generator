import Random from '../utils/RandomObject'
import { Vector3 } from 'three-math'
import { GREEK_LETTERS_NAMES, GREEK_LETTERS } from '../utils/alphabet'
import Names from './Names'
// import StarSystem from './System'
import PlanetarySubsystem from './PlanetarySubsystem'
import {
  STAR_COUNT_DISTIBUTION_IN_SYSTEMS,
} from '../CONSTANTS'
import Star from './Star'


class PlanetarySystem {
  _luminosity = null

  // GETTERS & SETTERS =========================================================
  get luminosity() { return this._luminosity }
  set luminosity(luminosity) { this._luminosity = luminosity }
  get star_mass() { return this._star_mass }
  set star_mass(star_mass) { this._star_mass = star_mass }
  get subsystem() { return this._subsystem }
  set subsystem(subsystem) { this._subsystem = subsystem }
  get random() {
    if (this._random == null) this._random = new Random(this.seed)
    return this._random
  }
  // END GETTERS & SETTERS =====================================================

  constructor(props = {}, random) {
    this.seed = props.seed
    this.name = props.name
    this.position = props.position //|| new Vector3()
  }

  async build() {
    await this.generateName()
    await this.generatePosition()
    await this.generateStars()
    return this
  }

  async generateName(force = false) {
    const name = await PlanetarySystem.generateName(this.random)
    if (!this.name || force) this.name = name
    return name
  }
  static async generateName(random) {
    return Names.Generate(random)
  }

  async generatePosition(force = false) {
    const position = await PlanetarySystem.generatePosition(this.random)
    if (!this.position || force) this.position = position
    return position
  }
  static async generatePosition(random) {
    return new Vector3()
  }

  async generateStars(force = false) {
    let stars = []
    for (let star of PlanetarySystem.generateStars(this.random)) {
      stars.push(star)
    }
    stars = stars.sort((a, b) => a.mass < b.mass)
    if (!this.stars || force) this.stars = stars
    return this.stars
  }
  static * generateStars(random) {
    try {
      const count = random.weighted(STAR_COUNT_DISTIBUTION_IN_SYSTEMS)
      if (count <= 0) return

      for (let i=0; i<count; i++) {
        yield new Star()
          .Generate(random)
      }
    } catch(err) { console.error(err) }
  }
  generateSubsystem(random, stars) {
    return PlanetarySubsystem.buildTree(stars)
      .Generate(random)
  }
  // generateSeed(random) {
  //   return random.seed()
  // }

  recalculate() {
    // this.stars.forEach(s => )
    for (let i=0; i<this.stars.length; i++ ) {
      const name = []
      if (this.stars.length > 1) name.push(GREEK_LETTERS[i])
      // const suffix = this.stars.length > 1 ? GREEK_LETTERS_NAMES[i] : ''
      name.push(this.name)
      this.stars[i].Name(name.join(' '))
    }
    if (this.subsystem) {
      this.star_mass = this.subsystem.mass
      this.luminosity = this.subsystem.luminosity
    }
  }

  Name(name) {
    this.name = name
    return this
  }
  Position(position) {
    this.position = position
    return this
  }

  async Generate(random = this.random) {
    const genList = [
      // ['seed', this.generateSeed],
      ['name', this.generateName],
      ['position', this.generatePosition],
      ['stars', (random) => [...this.generateStars(random)].sort((a, b) => a.mass < b.mass).map((s, i) => s.MassOrder(i))],
      // [''],
      ['subsystem', random => this.generateSubsystem(random, this.stars)],
    ]
    for (const [key, fun] of genList) {
      if (this[key] == null) this[key] = fun(random)
      // console.log(key, this[key]);
    }
    this.recalculate()
    return this
  }
}

export default PlanetarySystem
