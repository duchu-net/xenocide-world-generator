"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORBIT_OBJECT_TYPES = exports.OrbitGenerator = void 0;
const basic_generator_1 = require("../basic-generator");
var SystemBodyType;
(function (SystemBodyType) {
    SystemBodyType["EMPTY"] = "EMPTY";
    SystemBodyType["PLANET"] = "PLANET";
    SystemBodyType["ASTEROID_BELT"] = "ASTEROID_BELT";
})(SystemBodyType || (SystemBodyType = {}));
const defaultOptions = {
    maxInclinationDeg: 15,
};
const denormalize = (normalized, min, max) => normalized * (max - min) + min;
const normalize = (value, min, max) => (value - min) / (max - min);
class OrbitGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options = {}) {
        super(model, Object.assign(Object.assign({}, defaultOptions), options));
        this.schemaName = 'orbit-model';
        this.tags = [];
        this.lock = false;
        // this.distance = this.cutDecimals(props.distance, 2);
        this.generateOrbit();
    }
    generateOrbit() {
        const { maxInclinationDeg } = this.options;
        const pow = 3;
        const temp1 = 15;
        // todo near orbit has orbit inclination closer to 0
        // const temp1 = Math.pow(this.model.distance, pow);
        const random = this.random.integer(-temp1, temp1);
        let inclination = normalize(Math.pow(random, pow), Math.pow(-temp1, pow), Math.pow(temp1, pow));
        inclination = denormalize(inclination, -maxInclinationDeg, maxInclinationDeg);
        this.updateModel('inclination', inclination);
        this.updateModel('longitude', this.random.integer(-180, 180));
        this.updateModel('anomaly', this.random.integer(-180, 180));
    }
    setTags(tags) {
        this.tags = tags;
    }
    hasTag(tagName) {
        return this.tags.includes(tagName);
    }
    lockTag(tags) {
        if (!Array.isArray(tags))
            tags = [tags];
        this.lock = true;
        this.tags = tags;
    }
    markAsEmpty() {
        this.lock = true;
        this.tags = [];
    }
    generateType(random) {
        const tags = this.tags;
        if (tags.length == 0 || (tags.length == 1 && tags[0] == 'EMPTY')) {
            this.updateModel('bodyType', SystemBodyType.EMPTY);
            // this.updateModel('subtype', PlanetType.EMPTY);
            return;
        }
        const weighted = [];
        for (const tag of tags) {
            const orbitObject = exports.ORBIT_OBJECT_TYPES.find((ot) => ot.type == tag);
            if (!orbitObject)
                continue;
            weighted.push([orbitObject.probability, tag]);
        }
        const bodyType = random.weighted(weighted);
        // const subtype = random.weighted(weighted);
        // this.updateModel('subtype', subtype);
        // const type = ['EMPTY', 'ASTEROID_BELT'].includes(subtype) ? subtype : 'PLANET';
        this.updateModel('bodyType', bodyType);
    }
}
exports.OrbitGenerator = OrbitGenerator;
exports.ORBIT_OBJECT_TYPES = [
    { type: SystemBodyType.EMPTY, probability: 0.05, when: (star, orbit) => true },
    // {
    //   type: PlanetType.lava,
    //   probability: 0.2,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance < star.habitable_zone_inner * 0.7,
    // },
    // {
    //   type: PlanetType.barren,
    //   probability: 0.1,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.habitable_zone_inner * 0.18,
    // },
    // {
    //   type: PlanetType.desert,
    //   probability: 0.2,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
    //     orbit.distance > star.habitable_zone_inner * 0.7 && orbit.distance < star.frost_line,
    // },
    {
        type: SystemBodyType.ASTEROID_BELT,
        probability: 0.2,
        when: (star, orbit) => orbit.distance > star.frost_line * 0.1,
    },
    {
        type: SystemBodyType.PLANET,
        probability: 1,
        when: (star, orbit) => true,
    },
    // {
    //   type: PlanetType.earth,
    //   probability: 1,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
    //     orbit.distance > star.habitable_zone_inner && orbit.distance < star.habitable_zone_outer,
    // },
    // {
    //   type: PlanetType.ocean,
    //   probability: 0.3,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
    //     orbit.distance > star.habitable_zone_inner && orbit.distance < star.frost_line,
    // },
    // {
    //   type: PlanetType.ice,
    //   probability: 0.3,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => orbit.distance > star.frost_line,
    // },
    // {
    //   type: PlanetType.gas_giant,
    //   probability: 0.5,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
    //     orbit.distance > star.frost_line && orbit.distance < star.frost_line + (star.outer_limit - star.frost_line) * 0.5,
    // },
    // {
    //   type: PlanetType.ice_giant,
    //   probability: 0.6,
    //   when: (star: StarPhysicModel, orbit: OrbitPhysicModel) =>
    //     orbit.distance > star.frost_line && orbit.distance > star.frost_line + (star.outer_limit - star.frost_line) * 0.1,
    // },
];
//# sourceMappingURL=orbit-generator.js.map