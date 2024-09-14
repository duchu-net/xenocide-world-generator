"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarGenerator = void 0;
const utils_1 = require("../../utils");
const basic_generator_1 = require("../basic-generator");
const physic_1 = require("../physic");
const constant = (x) => () => x;
const defaultOptions = {
// seed: 999,
};
class StarGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options = defaultOptions) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        if (model.name && !model.id)
            this.name(model.name);
        const { spectralClass } = model;
        let { mass } = model;
        if (!mass) {
            const meta = spectralClass
                ? physic_1.StarPhysics.getSpectralByClass(spectralClass)
                : this.random.choice(physic_1.StarPhysics.SPECTRAL_CLASSIFICATION);
            mass = this.random.real(meta.min_sol_mass, meta.max_sol_mass);
        }
        this.mass(mass);
    }
    mass(value) {
        return value !== undefined ? (this.initializePhysic(value), this) : this.model.mass;
        // return value !== undefined ? ((this.model.mass = value), this.initializePhysic(value), this) : this.model.mass;
    }
    name(value, sequenceIndex) {
        return value !== undefined ? (this.initializeNaming(value, sequenceIndex), this) : this.model.name;
    }
    initializeNaming(initialName, sequenceIndex) {
        let id = initialName;
        let name = initialName;
        if (sequenceIndex !== undefined) {
            id = StarGenerator.getSequentialName(initialName, sequenceIndex, true);
            name = StarGenerator.getSequentialName(initialName, sequenceIndex);
        }
        this.model.id = (0, utils_1.codename)(id);
        this.model.name = name;
        this.model.path = `${this.model.parentPath}/s:${this.model.id}`;
    }
    initializePhysic(mass) {
        this.meta = physic_1.StarPhysics.getSpectralByMass(mass);
        this.model.mass = mass;
        this.model.spectralClass = this.meta.class;
        const model = { mass };
        model.subtype = this.meta.class;
        model.stellar_class = this.meta.class;
        model.evolution = this.meta.organisms_evolution;
        model.radius = physic_1.StarPhysics.calcRadius(model.mass);
        model.volume = physic_1.StarPhysics.calcVolume(model.radius);
        model.density = physic_1.StarPhysics.calcDensity(model.mass, model.radius);
        model.luminosity = physic_1.StarPhysics.calcLuminosity(model.mass);
        model.inner_limit = physic_1.StarPhysics.calcInnerLimit(model.mass);
        model.outer_limit = physic_1.StarPhysics.calcOuterLimit(model.mass);
        model.frost_line = physic_1.StarPhysics.calcFrostLine(model.luminosity);
        model.temperature = physic_1.StarPhysics.calcTemperature(model.luminosity, model.radius);
        model.color = physic_1.StarPhysics.calcColor(model.temperature);
        model.surface_area = physic_1.StarPhysics.calcSurfaceArea(model.radius);
        model.circumference = physic_1.StarPhysics.calcCircumference(model.radius);
        model.main_sequence_lifetime = physic_1.StarPhysics.calcMainSequenceLifetime(model.mass, model.luminosity);
        model.habitable_zone = physic_1.StarPhysics.calcHabitableZone(model.luminosity);
        model.habitable_zone_inner = physic_1.StarPhysics.calcHabitableZoneStart(model.luminosity);
        model.habitable_zone_outer = physic_1.StarPhysics.calcHabitableZoneEnd(model.luminosity);
        this.physic = model;
    }
    toModel() {
        return Object.assign(Object.assign({}, this.model), { physic: this.physic, meta: this.meta });
    }
    static getSequentialName(systemName, starIndex, standarize = false) {
        return `${systemName} ${standarize ? utils_1.GREEK_LETTERS_NAMES[starIndex] : (0, utils_1.numberToGreekChar)(starIndex)}`;
    }
    static sortByMass(stars) {
        return stars.sort((a, b) => b.mass() - a.mass());
    }
}
exports.StarGenerator = StarGenerator;
