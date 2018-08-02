import Random from '../utils/RandomObject'

class CelestialObject {
  static id = 0
  id = null
  name = null
  type = null // ONE OF [STAR,PLANET,SATELLITE,ASTEROID_BELT,MANMADE]
  parent = null
  parent_id = null
  code = null // eg. TAU.PLANETS.TAUI, TAU.STARS.TAU, TAU.STARS.TAUA
  designation = null
  orbit_period = null
  rotation_period = null
  habitable = null
  age = null
  appearance = "DEFAULT" // wygląd
  size = null

  constructor(props = {}, type) {
    Object.assign(this, props)
    this.setSeed(props.seed)
    this.setId(props.id)
    this.setType(props.type || type)
    this.setParent(props.parent)
    this.setSystem(props.system)
    // this.setName(props.name)
    this.setDesignation(props.designation)
  }

  setSeed(seed) {
    this.seed = seed || Date.now()
    this.random = new Random(this.seed)
  }

  setType(type) {
    this.type = type
  }

  setId(id) {
    this.id = id != null ? id : CelestialObject.getCurrentId()
  }

  setSystem(system) {
    this.system = system
    this.makeCode()
  }

  setName(name) {
    this.name = name
    this.makeCode()
  }

  setDesignation(designation) {
    this.designation = designation
    this.makeCode()
  }

  setParent(parent) {
    if (parent) {
      this.parent = parent
      this.parent_id = parent.id || null
    }
  }

  makeCode() {
    // console.log(this.system.name);
    const star_system_name = this.system ? this.system.name : ''
    const type = this.type
    const designation = (this.designation || '').split(' ').join('')
    const name = (this.name || '').split(' ').join('')
    this.code = (`${star_system_name}.${type}.${designation}${name}`).toUpperCase()
  }

  static getCurrentId() {
    return CelestialObject.id++
  }
}

export default CelestialObject
