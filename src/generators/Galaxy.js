import { Vector3 } from 'three-math'
import System from './System'
import Random from '../utils/RandomObject'
import Names from './Names'
import StarNames from './StarName'
import Grid from './Galaxies/Grid'
import Sphere from './Galaxies/Sphere'
import Spiral from './Galaxies/Spiral'
import Cluster from './Galaxies/Cluster'
import PlanetarySystem from './PlanetarySystem'

const GALAXY = {
  CLASSIFICATIONS_SHAPES: ['spiral', 'grid', 'sphere'/*, 'cluster'*/],
}


class Galaxy {
  // static defaultProps = {
  //   seed: null,
  //   name: 'no name',
  //   classification: 'grid',
  //   position: new Vector3(),
  // }
  objects = []
  buildData = {
    shape: null,
    gridOptions: [20, 7],
    random: null,
  }
  star_systems = []

  get statistics() {
    if (this._statistics == null) this.fillStatistics()
    return this._statistics
  }

  constructor(props = {}) {
    // this.props = Object.assign({}, Galaxy.defaultProps, props)
    Object.assign(this, props)
    const { seed, position, name, classification } = props

    this.setSeed(seed)
    this.setName(name)
    // this.setClassification(classification)
    this.setClassification(classification)
    this.setPosition(position)
  }

  setSeed(seed) {
    if (this.seed == null) {
      this.seed = seed || Date.now()
    }
    this.buildData.random = new Random(this.seed)
  }
  setName(name) {
    this.name = name || Names.GenerateGalaxyName(this.buildData.random)
    if (this.code == null) {
      this.code = `GALAXY.${this.name.toUpperCase().replace(new RegExp(' ', 'g'), '')}`
    }
  }
  setClassification(classification) {
    // this.classification = classification || 'grid'
    const { random } = this.buildData
    const classificationT = random.choice(GALAXY.CLASSIFICATIONS_SHAPES)
    if (!classification) this.classification = classificationT
    else this.classification = classification
  }
  setPosition(position) {
    this.position = position || new Vector3()
  }
  // setName(name) {
  //   this.name = name //|| Names.Generate(this.random)
  //   this.code = `GALAXY.${this.name.toUpperCase().replace(new RegExp(' ', 'g'), '')}`
  // }

  // async getResult() {
  //   return {
  //     seed: this.seed,
  //     name: this.name,
  //     classification: this.classification
  //   }
  // }

  // fillBuildData() {
  //   this.buildData.random = new Random(this.seed)
  //   // this._random = new Random(this.seed)
  // }

  getShape() {
    let shape = null
    switch (this.classification) {
      case 'spiral': shape = new Spiral(); break
      case 'sphere': shape = new Sphere(); break
      // case 'cluster': shape = new Cluster(); break
      case 'grid':
      default: shape = new Grid(...(this.buildData.gridOptions || []))
    }
    return shape
  }
  // async generateShape() {
  //   const { random } = this.buildData
  //   let shape = null
  //   switch (this.classification) {
  //     case 'spiral': shape = new Spiral(); break
  //     case 'sphere': shape = new Sphere(); break
  //     case 'cluster': shape = new Cluster(); break
  //     case 'grid':
  //     default: shape = new Grid(15, 10)
  //   }
  //   // const protoStars = [...shape.Generate(this.buildData.random)]
  //   for (let system of shape.Generate(random)) {
  //     let systemSeed = random.next()
  //     // CHECK UNIQUE SEED
  //     while (this.objects.find(o => o.seed == systemSeed)) systemSeed = random.next()
  //     // ADD TOO GALAXY OBJECTS
  //     this.objects.push({ ...system, type: 'system', seed: systemSeed })
  //   }
  //   // this.buildData.shape = [...shape.Generate(this.buildData.random)]
  //   // this.star_systems = protoStars.map(ps => new System('123', ps))
  //   // return this
  // }
  * generateSystems() {
    const { random } = this.buildData
    // console.log(this._random.integer);
    const shape = this.getShape()
    for (let system of shape.Generate(random)) {
      // CHECK UNIQUE SEED
      let systemSeed = random.next()
      while (this.star_systems.find(o => o.seed == systemSeed)) systemSeed = random.next()
      let systemName = StarNames.Generate(random)
      while (this.star_systems.find(o => {
        // console.log();
        // console.log(o.name, systemName, o.name.toLowerCase() == systemName.toLowerCase());
        return o.name.toLowerCase() == systemName.toLowerCase()
      })) systemName = StarNames.Generate(random)
      // CREATE SYSTEM
      // console.log('*', system);
      const ss = new System({
        name: systemName,
        seed: systemSeed,
        position: { ...system.position },
        temperature: system.temperature,
      })
      this.star_systems.push(ss)
      yield ss
    }
    this.fillStatistics()
  }



  fillStatistics() {
    this._statistics = {
      star_systems: this.star_systems.length,
    }
  }

  getSystems() {
    return this.star_systems
  }

  GenerateUniqNames(random) {
    // return Names.Generate
    // const random = new Random()
    // return Array(this.star_systems.length).map(() => Names.Generate(random))
    this.star_systems.forEach(ss => ss.Name(Names.Generate(random)))
    return this
  }
  GenerateStars(shape) {
    const protoStars = [...shape.Generate(this._random)]
    this.star_systems = protoStars.map(ps => new System('123', ps))
    return this
  }

  async GenerateSystems(random, systems) {
    // const protoStars = [...shape.Generate(this._random)]
    // for await (const system of systems)
    const star_systems = []
    for (const system of systems) star_systems.push(await new PlanetarySystem().Position(system.position).Generate(random))
    // this.star_systems = systems.map(ps => new PlanetarySystem().Name(ps.name).Generate(random))
    this.star_systems = star_systems
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
      const galaxy = new Galaxy({ seed: '123' })
      await galaxy.GenerateSystems(random, shape)
      await galaxy.GenerateUniqNames(random)
      return galaxy

      // return new Galaxy('seed')
      //   .GenerateSystems(random, shape)
      //   .GenerateUniqNames()
    } catch(err) {
      console.error('ERR>', err);
    }
  }
}

export default Galaxy
