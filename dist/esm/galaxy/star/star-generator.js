import { codename, GREEK_LETTERS_NAMES, numberToGreekChar } from '../../utils';
import { RandomGenerator } from '../basic-generator';
import { StarPhysics } from '../physic';
const constant = (x) => () => x;
const defaultOptions = {
// seed: 999,
};
export class StarGenerator extends RandomGenerator {
    constructor(model, options = defaultOptions) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        if (model.name && !model.id)
            this.name(model.name);
        const { spectralClass } = model;
        let { mass } = model;
        if (!mass) {
            const meta = spectralClass
                ? StarPhysics.getSpectralByClass(spectralClass)
                : this.random.choice(StarPhysics.SPECTRAL_CLASSIFICATION);
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
        this.model.id = codename(id);
        this.model.name = name;
        this.model.path = `${this.model.parentPath}/s:${this.model.id}`;
    }
    initializePhysic(mass) {
        this.meta = StarPhysics.getSpectralByMass(mass);
        this.model.mass = mass;
        this.model.spectralClass = this.meta.class;
        const model = { mass };
        model.subtype = this.meta.class;
        model.stellar_class = this.meta.class;
        model.evolution = this.meta.organisms_evolution;
        model.radius = StarPhysics.calcRadius(model.mass);
        model.volume = StarPhysics.calcVolume(model.radius);
        model.density = StarPhysics.calcDensity(model.mass, model.radius);
        model.luminosity = StarPhysics.calcLuminosity(model.mass);
        model.inner_limit = StarPhysics.calcInnerLimit(model.mass);
        model.outer_limit = StarPhysics.calcOuterLimit(model.mass);
        model.frost_line = StarPhysics.calcFrostLine(model.luminosity);
        model.temperature = StarPhysics.calcTemperature(model.luminosity, model.radius);
        model.color = StarPhysics.calcColor(model.temperature);
        model.surface_area = StarPhysics.calcSurfaceArea(model.radius);
        model.circumference = StarPhysics.calcCircumference(model.radius);
        model.main_sequence_lifetime = StarPhysics.calcMainSequenceLifetime(model.mass, model.luminosity);
        model.habitable_zone = StarPhysics.calcHabitableZone(model.luminosity);
        model.habitable_zone_inner = StarPhysics.calcHabitableZoneStart(model.luminosity);
        model.habitable_zone_outer = StarPhysics.calcHabitableZoneEnd(model.luminosity);
        this.physic = model;
    }
    toModel() {
        return Object.assign(Object.assign({}, this.model), { physic: this.physic, meta: this.meta });
    }
    static getSequentialName(systemName, starIndex, standarize = false) {
        return `${systemName} ${standarize ? GREEK_LETTERS_NAMES[starIndex] : numberToGreekChar(starIndex)}`;
    }
    static sortByMass(stars) {
        return stars.sort((a, b) => b.mass() - a.mass());
    }
}
