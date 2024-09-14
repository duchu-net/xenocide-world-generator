"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemOrbitsGenerator = void 0;
const basic_generator_1 = require("../basic-generator");
const physic_1 = require("../physic");
const orbit_generator_1 = require("../physic/orbit-generator");
const defaultOptions = {
    prefer_habitable: true,
};
class SystemOrbitsGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.orbits = [];
        this.beetwen_orbits_factor = [1.4, 2];
        this.modyficators = [];
    }
    *generateOrbits() {
        // console.log('*generateOrbits()');
        if (!this.orbits.length)
            this.build();
        for (const orbit of this.orbits)
            yield orbit;
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
        for (const modyficator of this.modyficators)
            modyficator(this.random, opts)(this);
        for (const orbit of this.orbits)
            orbit.generateType(this.random);
        // this.fillInfo(); // todo
        return true;
    }
    generateTopology() {
        const topology = this.random.weighted(TOPOLOGIES.map((top) => [top.probability, top]));
        this.topology = topology.name;
        this.modyficators = topology.modyficators;
    }
    generateProtoOrbits() {
        var _a;
        if (!((_a = this.options.star) === null || _a === void 0 ? void 0 : _a.physic))
            throw new Error('no star available');
        const { physic } = this.options.star;
        let firstOrbitdistance = null;
        const createOrbit = (distance) => this.orbits.push(new orbit_generator_1.OrbitGenerator({ distance, order: this.orbits.length }, { seed: this.random.seed() }));
        // Get fist orbit distance
        if (this.options.prefer_habitable) {
            // Make sure at least one habitable will be generated
            firstOrbitdistance = this.random.real(physic.habitable_zone_inner, physic.habitable_zone_outer);
        }
        else {
            firstOrbitdistance = this.random.real(physic.inner_limit, physic.outer_limit);
        }
        createOrbit(firstOrbitdistance);
        // Fill orbits down
        let lastDistance = firstOrbitdistance;
        while (true) {
            const nextOrbit = lastDistance / this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
            if (nextOrbit < physic.inner_limit)
                break;
            createOrbit(nextOrbit);
            lastDistance = nextOrbit;
        }
        // Fill orbits up
        lastDistance = firstOrbitdistance;
        while (true) {
            const nextOrbit = lastDistance * this.random.real(this.beetwen_orbits_factor[0], this.beetwen_orbits_factor[1]);
            if (nextOrbit > physic.outer_limit)
                break;
            createOrbit(nextOrbit);
            lastDistance = nextOrbit;
        }
        // Sort by distance
        this.orbits.sort((ox, oy) => physic_1.OrbitPhysic.sortByDistance(ox.model, oy.model));
        // Fill from sun order
        this.orbits.forEach((orbit, index) => orbit.updateModel('order', index + 1));
    }
    fillOrbitZone() {
        var _a;
        if (!((_a = this.options.star) === null || _a === void 0 ? void 0 : _a.physic))
            throw new Error('no star available');
        const { physic } = this.options.star;
        for (const orbit of this.orbits) {
            orbit.updateModel('zone', physic_1.OrbitPhysic.calcZone(orbit.model.distance, physic));
        }
    }
    fillOrbitPeriod() {
        var _a;
        for (const orbit of this.orbits) {
            const mass = ((_a = this.options.star.physic) === null || _a === void 0 ? void 0 : _a.mass) || this.options.star.mass;
            const orbitalPeriod = physic_1.OrbitPhysic.calcOrbitalPeriod(mass, orbit.model.distance);
            orbit.updateModel('orbitalPeriod', orbitalPeriod);
            orbit.updateModel('orbitalPeriodInDays', physic_1.OrbitPhysic.convertOrbitalPeriodToDays(orbitalPeriod));
        }
    }
    // static _generationStrategies = [
    //   [1, PlanetOrbitGenerator.ClassicSystem],
    //   [.1, PlanetOrbitGenerator.HabitableMoonSystem],
    //   [.05, PlanetOrbitGenerator.HotJupiterSystem]
    // ]
    // todo fix that after planet rework - not working properly
    static ClassicSystem(random, { prefer_habitable }) {
        return (systemOrbit) => {
            var _a, _b;
            // systemOrbit.topology = 'classic'
            for (const orbit of systemOrbit.orbits) {
                let tags = [];
                for (const orbitObject of orbit_generator_1.ORBIT_OBJECT_TYPES) {
                    if ((_a = orbitObject.when) === null || _a === void 0 ? void 0 : _a.call(orbitObject, (_b = systemOrbit.options.star) === null || _b === void 0 ? void 0 : _b.physic, orbit.model))
                        tags.push(orbitObject.type);
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
    static HabitableMoonSystem(random) {
        return (planetOrbit) => {
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
                }
                else if (findedHabitable && !findedGasGiant) {
                    // orbit.tags = ['EMPTY']
                    orbit.markAsEmpty();
                }
                if (isGiant)
                    findedGasGiant = true;
            }
        };
    }
}
exports.SystemOrbitsGenerator = SystemOrbitsGenerator;
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
];
