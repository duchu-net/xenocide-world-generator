import { RandomObject, Seed } from '../utils';
import { RandomGenerator } from './basic-generator';
import { OrbitPhysic, OrbitPhysicModel, StarPhysicModel } from './physic';
import { OrbitGenerator, OrbitModel, ORBIT_OBJECT_TYPES } from './physic/orbit-generator';
import { StarGenerator, StarModel } from './star-generator';

interface SystemOrbitOptions {
  seed?: Seed;
  random?: RandomObject;
  prefer_habitable?: boolean;
  star: StarModel; // todo StarPhysic be enought
}
export interface SystemOrbitModel extends Partial<OrbitModel> {
  options?: Partial<SystemOrbitOptions>;

  fromStar?: number;
}

const defaultOptions: Partial<SystemOrbitOptions> = {
  prefer_habitable: true,
};

export class SystemOrbitsGenerator extends RandomGenerator<SystemOrbitModel, SystemOrbitOptions> {
  // public readonly options: SystemOrbitOptions;
  // random: RandomObject;

  // Evry value is in AU unit
  // inner_limit = 0.15;
  // habitable_zone_inner = 0.95;
  // habitable_zone_outer = 1.37;
  // frost_line = 4.85;
  // outer_limit = 40;

  topology?: string;
  orbits: OrbitGenerator[] = [];
  beetwen_orbits_factor = [1.4, 2];
  modyficators: (typeof SystemOrbitsGenerator.ClassicSystem | typeof SystemOrbitsGenerator.HabitableMoonSystem)[] = [];

  // constructor(options: SystemOrbitOptions) {
  //   this.options = { ...defaultOptions, ...options };

  //   if (!options.seed) this.options.seed = RandomObject.randomSeed();
  //   this.random = options.random || new RandomObject(this.options.seed);
  // }
  constructor(model: SystemOrbitModel, options: SystemOrbitOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });
  }

  *generateOrbits(): IterableIterator<OrbitGenerator> {
    // console.log('*generateOrbits()');
    if (!this.orbits.length) this.build();
    for (const orbit of this.orbits) yield orbit;
  }

  build() {
    this.generateTopology();
    this.generateProtoOrbits();
    this.fillOrbitZone();
    this.fillOrbitPeriod();
    // console.log('build()', this);
    const opts = {
      prefer_habitable: this.options.prefer_habitable,
    };
    for (const modyficator of this.modyficators) modyficator(this.random, opts)(this);
    for (const orbit of this.orbits) orbit.generateType(this.random);
    // this.fillInfo(); // todo
    return true;
  }

  generateTopology() {
    const topology = this.random.weighted(TOPOLOGIES.map((top) => [top.probability, top]));
    this.topology = topology.name;
    this.modyficators = topology.modyficators;
  }

  generateProtoOrbits() {
    if (!this.options.star?.physic) throw new Error('no star available');

    const { physic } = this.options.star;
    let firstOrbitdistance = null;

    // Get fist orbit distance
    if (this.options.prefer_habitable) {
      // Make sure at least one habitable will be generated
      firstOrbitdistance = this.random.real(physic.habitable_zone_inner, physic.habitable_zone_outer);
    } else {
      firstOrbitdistance = this.random.real(physic.inner_limit, physic.outer_limit);
    }
    this.orbits.push(new OrbitGenerator({ distance: firstOrbitdistance }, { seed: this.random.seed() }));
    // Fill orbits down
    let lastDistance = firstOrbitdistance;
    while (true) {
      const nextOrbit = lastDistance / this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
      if (nextOrbit < physic.inner_limit) break;
      this.orbits.push(new OrbitGenerator({ distance: nextOrbit }, { seed: this.random.seed() }));
      lastDistance = nextOrbit;
    }
    // Fill orbits up
    lastDistance = firstOrbitdistance;
    while (true) {
      const nextOrbit = lastDistance * this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
      if (nextOrbit > physic.outer_limit) break;
      this.orbits.push(new OrbitGenerator({ distance: nextOrbit }, { seed: this.random.seed() }));
      lastDistance = nextOrbit;
    }
    // Sort by distance
    this.orbits.sort((a, b) => a.model.distance - b.model.distance);
    // Fill from sun order
    for (const [index, orbit] of this.orbits.entries()) {
      orbit.updateModel('fromStar', index + 1);
    }
  }

  fillOrbitZone() {
    if (!this.options.star?.physic) throw new Error('no star available');
    const { physic } = this.options.star;

    for (const orbit of this.orbits) {
      orbit.updateModel('zone', OrbitPhysic.calcZone(orbit.model.distance, physic));
    }
  }

  fillOrbitPeriod() {
    for (const orbit of this.orbits) {
      const orbitalPeriod = OrbitPhysic.calcOrbitalPeriod(this.options.star.mass as number, orbit.model.distance);
      orbit.updateModel('orbitalPeriod', orbitalPeriod);
      orbit.updateModel('orbitalPeriodInDays', OrbitPhysic.convertOrbitalPeriodToDays(orbitalPeriod));
    }
  }

  // toModel(): SystemOrbitModel {
  //   return { ...this.model };
  // }

  // static _generationStrategies = [
  //   [1, PlanetOrbitGenerator.ClassicSystem],
  //   [.1, PlanetOrbitGenerator.HabitableMoonSystem],
  //   [.05, PlanetOrbitGenerator.HotJupiterSystem]
  // ]
  static ClassicSystem(random: RandomObject, { prefer_habitable }: { prefer_habitable?: boolean }) {
    return (planetOrbit: SystemOrbitsGenerator) => {
      // planetOrbit.topology = 'classic'
      for (const orbit of planetOrbit.orbits) {
        let tags = [];
        for (const orbitObject of ORBIT_OBJECT_TYPES) {
          if (orbitObject.when?.(planetOrbit.options.star?.physic as StarPhysicModel, orbit.model))
            tags.push(orbitObject.type);
        }
        if (prefer_habitable && tags.indexOf('earth') > -1) {
          tags = ['earth'];
        }
        orbit.tags = tags;
      }
    };
  }
  // Jupiter like planet (gas giant) transfer to habitable zone from outer zone,
  // space between is cleared by giant.
  static HabitableMoonSystem(random: RandomObject) {
    return (planetOrbit: SystemOrbitsGenerator) => {
      // planetOrbit.topology = 'habitable_moon'
      let findedHabitable = false;
      let findedGasGiant = false;
      for (const orbit of planetOrbit.orbits) {
        const isGiant = orbit.tags.some((tgs: string) => tgs == 'gas_giant');
        if (orbit.model.zone == 'habitable' && !findedHabitable) {
          orbit.lockTag('gas_giant');
          // orbit.generateMoons(random, { min_one: ['earth'] })
          // orbit.lock = true
          // orbit.tags = ['gas_giant']
          findedHabitable = true;
        } else if (findedHabitable && !findedGasGiant) {
          // orbit.tags = ['EMPTY']
          orbit.markAsEmpty();
        }
        if (isGiant) findedGasGiant = true;
      }
    };
  }
  // static HotJupiterSystem(random) {
  //   return (planetOrbit) => {
  //     // planetOrbit.topology = 'hot_jupiter'
  //     let findedGasGiant = false;
  //     for (const [index, orbit] of planetOrbit.orbits.entries()) {
  //       const isGiant = orbit.tags.some((tgs) => tgs == 'gas_giant');
  //       if (index == 0) {
  //         orbit.lockTag('gas_giant');
  //         // orbit.lock = true
  //         // orbit.tags = ['gas_giant']
  //       } else if (!findedGasGiant) {
  //         orbit.markAsEmpty();
  //         // orbit.tags = ['EMPTY']
  //       }
  //       if (isGiant) findedGasGiant = true;
  //     }
  //   };
  // }
}

const TOPOLOGIES = [
  { probability: 1, name: 'classic', modyficators: [SystemOrbitsGenerator.ClassicSystem] },
  {
    probability: 0.1,
    name: 'habitable_moon',
    modyficators: [SystemOrbitsGenerator.ClassicSystem, SystemOrbitsGenerator.HabitableMoonSystem],
  },
  // {
  //   probability: 0.01,
  //   name: 'hot_jupiter',
  //   modyficators: [SystemOrbitsGenerator.ClassicSystem, SystemOrbitsGenerator.HotJupiterSystem],
  // },
  // {
  //   probability: 0.05,
  //   name: 'hot_jupiter_habitable_moon',
  //   modyficators: [
  //     SystemOrbitsGenerator.ClassicSystem,
  //     SystemOrbitsGenerator.HotJupiterSystem,
  //     SystemOrbitsGenerator.HabitableMoonSystem,
  //   ],
  // },
] as const;
