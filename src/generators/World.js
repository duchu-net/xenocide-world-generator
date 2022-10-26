import { Vector3 } from 'three-math';
import System from './System';
import Random from '../utils/RandomObject';
import Names from './Names';
import Grid from './Galaxies/Grid';
import Sphere from './Galaxies/Sphere';
import Spiral from './Galaxies/Spiral';
import Cluster from './Galaxies/Cluster';
import PlanetarySystem from './PlanetarySystem';
import Galaxy from './Galaxy';

const GALAXY = {
  CLASSIFICATIONS_SHAPES: ['spiral', 'grid', 'sphere', 'cluster'],
};

export class World {
  static defaultProps = {
    seed: null,
    name: 'no_name',
    classification: 'grid',
    position: new Vector3(),
  };
  objects = [];
  buildData = {
    shape: null,
    random: null,
  };
  star_systems = [];

  get statistics() {
    if (this._statistics == null) this.fillStatistics();
    return this._statistics;
  }

  constructor(props = {}) {
    this.props = Object.assign({}, World.defaultProps, props);

    this.seed = this.props.seed || Date.now();
    this.setName(this.props.name);
    // this.name = this.props.name

    this.galaxies = this.props.galaxies;
    // this.position = this.props.position

    this.fillBuildData();
  }

  async build() {
    // await this.generateName()
    // await this.generateClassification()
    return this;
  }

  setName(name) {
    this.name = name; //|| Names.Generate(this.random)
    // this.code = this.name.toUpperCase()
    this.code = `WORLD.${this.name.toUpperCase().replace(new RegExp(' ', 'g'), '')}`;
  }
  async generateName() {
    const name = 'abc'; // must be generateted with random
    // console.log(this.name, name);
    if (!this.name) this.name = name;
  }

  fillBuildData() {
    this.buildData.random = new Random(this.seed);
    // this._random = new Random(this.seed)
  }

  *generateGalaxies() {
    try {
      const maxGalaxies = 1;
      const galaxiesCount = Array.isArray(this.galaxies) ? this.galaxies.length : 0;
      for (let i = galaxiesCount; i < maxGalaxies; i++) {
        yield new Galaxy();
      }
    } catch (err) {
      console.error('* generateGalaxies>', err);
      return null;
    }

    // const { random } = this.buildData
    // // console.log(this._random.integer);
    // const shape = this.getShape()
    // for (let system of shape.Generate(random)) {
    //   // CHECK UNIQUE SEED
    //   let systemSeed = random.next()
    //   while (this.star_systems.find(o => o.seed == systemSeed)) systemSeed = random.next()
    //   let systemName = Names.Generate(random)
    //   while (this.star_systems.find(o => {
    //     // console.log();
    //     // console.log(o.name, systemName, o.name.toLowerCase() == systemName.toLowerCase());
    //     return o.name.toLowerCase() == systemName.toLowerCase()
    //   })) systemName = Names.Generate(random)
    //   // CREATE SYSTEM
    //   // console.log('*', system);
    //   const ss = new System({
    //     name: systemName,
    //     seed: systemSeed,
    //     position: { ...system.position },
    //     temperature: system.temperature,
    //   })
    //   this.star_systems.push(ss)
    //   yield ss
    // }
  }

  GenerateUniqNames(random) {
    // return Names.Generate
    // const random = new Random()
    // return Array(this.star_systems.length).map(() => Names.Generate(random))
    this.star_systems.forEach((ss) => ss.Name(Names.Generate(random)));
    return this;
  }
  GenerateStars(shape) {
    const protoStars = [...shape.Generate(this._random)];
    this.star_systems = protoStars.map((ps) => new System('123', ps));
    return this;
  }

  // async GenerateSystems(random, systems) {
  //   // const protoStars = [...shape.Generate(this._random)]
  //   // for await (const system of systems)
  //   const star_systems = []
  //   for (const system of systems) star_systems.push(await new PlanetarySystem().Position(system.position).Generate(random))
  //   // this.star_systems = systems.map(ps => new PlanetarySystem().Name(ps.name).Generate(random))
  //   this.star_systems = star_systems
  //   return this
  // }

  // static async Generate(spec, random) {
  //   try {
  //     if (spec == null) spec = new Grid(15, 10)
  //     if (random == null) random = new Random()
  //     const shape = Array.from(spec.GenerateShape(random))
  //     // const s = [...spec.Generate(random)]
  //     // const stars = spec.Generate(random)
  //     // const systems = Array.from(spec.Generate(random))
  //     // console.log('>>>',spec, systems,'<<<');
  //     const galaxy = new Galaxy({ seed: '123' })
  //     await galaxy.GenerateSystems(random, shape)
  //     await galaxy.GenerateUniqNames(random)
  //     return galaxy
  //
  //     // return new Galaxy('seed')
  //     //   .GenerateSystems(random, shape)
  //     //   .GenerateUniqNames()
  //   } catch(err) {
  //     console.error('ERR>', err);
  //   }
  // }
}

export default World;
