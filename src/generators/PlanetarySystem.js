import Random from '../utils/RandomObject'
import { Vector3 } from 'three'
import { GREEK_LETTERS_NAMES, GREEK_LETTERS } from '../utils/alphabet'
import Names from './Names'
import StarSystem from './StarSystem'
import PlanetarySubsystem from './PlanetarySubsystem'
import {
  STAR_COUNT_DISTIBUTION_IN_SYSTEMS,
} from '../CONSTANTS'
import Star from './Star'


class PlanetarySystem {
  _luminosity = null

  // GETTERS & SETTERS =========================================================
  get seed() { return this._seed }
  set seed(seed) {
    this._seed = seed || new Date().getTime()
  }
  get name() { return this._name }
  set name(name) { this._name = name }
  get luminosity() { return this._luminosity }
  set luminosity(luminosity) { this._luminosity = luminosity }
  get position() { return this._position }
  set position(position) { this._position = position }
  get star_mass() { return this._star_mass }
  set star_mass(star_mass) { this._star_mass = star_mass }
  get subsystem() { return this._subsystem }
  set subsystem(subsystem) { this._subsystem = subsystem }
  get stars() { return this._stars }
  set stars(stars) { this._stars = stars }
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

  generateName(random) {
    return Names.Generate(random)
  }
  generatePosition(random) {
    return new Vector3()
  }
  * generateStars(random) {
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
