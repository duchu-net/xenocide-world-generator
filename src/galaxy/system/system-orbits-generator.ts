import { RandomObject, Seed } from '../../utils';
import { RandomGenerator } from '../basic-generator';
import { OrbitPhysic, OrbitPhysicModel, StarPhysicModel } from '../physic';
import { ORBIT_OBJECT_TYPES, OrbitGenerator, OrbitModel } from '../physic/orbit-generator';
import { StarModel } from '../star';

interface SystemOrbitOptions {
  seed?: Seed;
  random?: RandomObject;
  prefer_habitable?: boolean;
  star: StarModel; // todo StarPhysic be enought
}
export interface SystemOrbitModel extends Partial<OrbitModel> {
  options?: Partial<SystemOrbitOptions>;
  order?: number;
}

const defaultOptions: Partial<SystemOrbitOptions> = {
  prefer_habitable: true,
};

export class SystemOrbitsGenerator extends RandomGenerator<SystemOrbitModel, SystemOrbitOptions> {
  public orbits: OrbitGenerator[] = [];
  public topology?: string;
  public beetwen_orbits_factor = [1.4, 2];
  public modyficators: (
    | typeof SystemOrbitsGenerator.ClassicSystem
    | typeof SystemOrbitsGenerator.HabitableMoonSystem
  )[] = [];

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

    const createOrbit = (distance: number) =>
      this.orbits.push(new OrbitGenerator({ distance, order: this.orbits.length }, { seed: this.random.seed() }));

    // Get fist orbit distance
    if (this.options.prefer_habitable) {
      // Make sure at least one habitable will be generated
      firstOrbitdistance = this.random.real(physic.habitable_zone_inner, physic.habitable_zone_outer);
    } else {
      firstOrbitdistance = this.random.real(physic.inner_limit, physic.outer_limit);
    }
    createOrbit(firstOrbitdistance);
    // Fill orbits down
    let lastDistance = firstOrbitdistance;
    while (true) {
      const nextOrbit = lastDistance / this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
      if (nextOrbit < physic.inner_limit) break;
      createOrbit(nextOrbit);
      lastDistance = nextOrbit;
    }
    // Fill orbits up
    lastDistance = firstOrbitdistance;
    while (true) {
      const nextOrbit = lastDistance * this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
      if (nextOrbit > physic.outer_limit) break;
      createOrbit(nextOrbit);
      lastDistance = nextOrbit;
    }
    // Sort by distance
    this.orbits.sort((ox, oy) => OrbitPhysic.sortByDistance(ox.model, oy.model));
    // Fill from sun order
    this.orbits.forEach((orbit, index) => orbit.updateModel('order', index + 1));
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
      const mass = this.options.star.physic?.mass || (this.options.star.mass as number);
      const orbitalPeriod = OrbitPhysic.calcOrbitalPeriod(mass, orbit.model.distance);
      orbit.updateModel('orbitalPeriod', orbitalPeriod);
      orbit.updateModel('orbitalPeriodInDays', OrbitPhysic.convertOrbitalPeriodToDays(orbitalPeriod));
    }
  }

  // static _generationStrategies = [
  //   [1, PlanetOrbitGenerator.ClassicSystem],
  //   [.1, PlanetOrbitGenerator.HabitableMoonSystem],
  //   [.05, PlanetOrbitGenerator.HotJupiterSystem]
  // ]
  // todo fix that after planet rework - not working properly
  static ClassicSystem(random: RandomObject, { prefer_habitable }: { prefer_habitable?: boolean }) {
    return (systemOrbit: SystemOrbitsGenerator) => {
      // systemOrbit.topology = 'classic'
      for (const orbit of systemOrbit.orbits) {
        let tags = [];
        for (const orbitObject of ORBIT_OBJECT_TYPES) {
          if (orbitObject.when?.(systemOrbit.options.star?.physic as StarPhysicModel, orbit.model))
            tags.push(orbitObject.type as string);
        }
        if (prefer_habitable && tags.includes('earth')) {
          tags = ['earth'];
        }
        orbit.setTags(tags);
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
        const isGiant = orbit.hasTag('gas_giant');
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
