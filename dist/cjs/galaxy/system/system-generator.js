"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemGenerator = void 0;
const three_1 = require("three");
const utils_1 = require("../../utils");
const basic_generator_1 = require("../basic-generator");
const physic_1 = require("../physic");
const planet_1 = require("../planet");
const star_1 = require("../star");
const debris_belt_generator_1 = require("./debris-belt-generator");
const empty_zone_1 = require("./empty-zone");
const system_orbits_generator_1 = require("./system-orbits-generator");
const defaultOptions = {
    // position: new Vector3(0, 0, 0),
    seed: 0,
    starsSeed: 0,
    planetsSeed: 0,
    prefer_habitable: true,
};
// enum GenerationStep {
//   INIT = 'init',
//   BASIC = 'basic',
//   STARS = 'stars',
//   PLANETS = 'planets',
//   FINISHED = 'finished',
// }
class SystemGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options = {}) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'SystemModel';
        this.stars = [];
        // public readonly orbits: OrbitGenerator[] = [];
        this.orbits = [];
        this.belts = [];
        this.planets = [];
        if (!this.options.starsSeed)
            this.options.starsSeed = this.random.seed();
        if (!this.options.planetsSeed)
            this.options.planetsSeed = this.random.seed();
        this.physic = Object.assign({}, model.physic);
        if (!model.id)
            this.model.id = (0, utils_1.codename)(this.model.name);
        if (!model.path)
            this.model.path = `${this.model.parentPath}/${this.model.id}`;
        if (!model.position)
            this.model.position = new three_1.Vector3();
    }
    get name() {
        return this.model.name || 'Example System 1'; // todo
    }
    get position() {
        return this.model.position;
    }
    *generateStars() {
        var _a, _b, _c;
        try {
            const random = new utils_1.RandomObject(this.options.starsSeed);
            const { spectralClass } = this.options;
            // console.log({spectralClass, temperature: this.model.temperature})
            const count = random.weighted(physic_1.STAR_COUNT_DISTIBUTION_IN_SYSTEMS);
            // if (count <= 0) return;
            for (let i = 0; i < count; i++) {
                const star = new star_1.StarGenerator({
                    // todo when spectralClass is provided, next star should be smaller
                    spectralClass: spectralClass && i === 0 ? spectralClass : undefined,
                    parentPath: this.model.path,
                }, { random });
                this.stars.push(star);
                yield star;
            }
            star_1.StarGenerator.sortByMass(this.stars);
            const isSingleStar = this.stars.length === 1;
            this.stars.forEach((star, index) => (isSingleStar ? star.name(this.name) : star.name(this.name, index)));
            if (this.stars[0]) {
                this.model.starColor = (_a = this.stars[0].physic) === null || _a === void 0 ? void 0 : _a.color;
                this.model.starRadius = (_b = this.stars[0].physic) === null || _b === void 0 ? void 0 : _b.radius;
                // this.model.habitable = this.stars[0].physic?.habitable;
                this.physic.color = (_c = this.stars[0].physic) === null || _c === void 0 ? void 0 : _c.color;
            }
            this.physic.starsCount = this.stars.length;
            // this.fillStarInfo(); // todo
        }
        catch (e) {
            console.warn('*generateStars()', e);
        }
    }
    getStarsModels() {
        if (this.stars.length)
            return this.stars.map((it) => it.toModel());
        return this.model.stars || [];
    }
    *generatePlanets() {
        try {
            const random = new utils_1.RandomObject(this.options.planetsSeed);
            let nameIndex = 0;
            for (const orbitGenerator of this.generateOrbits()) {
                // this.orbits.push(orbitGenerator);
                const orbit = orbitGenerator.toModel();
                let bodyGenerator;
                if (orbit.bodyType === 'PLANET') {
                    bodyGenerator = new planet_1.PlanetGenerator({
                        name: planet_1.PlanetGenerator.getSequentialName(this.name, nameIndex++),
                        parentPath: this.model.path,
                        orbit,
                    }, { star: this.getStarsModels()[0], seed: random.seed() });
                    this.orbits.push({ bodyType: orbit.bodyType, planetPath: bodyGenerator.model.path });
                    this.planets.push(bodyGenerator);
                }
                else if (orbit.bodyType === 'ASTEROID_BELT') {
                    bodyGenerator = new debris_belt_generator_1.DebrisBeltGenerator({
                        name: debris_belt_generator_1.DebrisBeltGenerator.getSequentialName(nameIndex++),
                        parentPath: this.model.path,
                        orbit,
                    }, { seed: random.seed() });
                    this.orbits.push({ bodyType: orbit.bodyType, beltPath: bodyGenerator.model.path });
                    this.belts.push(bodyGenerator);
                }
                else {
                    bodyGenerator = new empty_zone_1.EmptyZone({
                        name: empty_zone_1.EmptyZone.getSequentialName(nameIndex++),
                        orbit,
                    });
                    this.orbits.push({ bodyType: 'EMPTY' });
                }
                // this.orbits.push({bodyType: orbit.bodyType, }); // todo whole orbit logic should be separated, but accessible :?
                yield bodyGenerator;
            }
            this.physic.planetsCount = this.planets.length;
            this.physic.asteroidsCount = this.belts.length;
            // this.fillPlanetInfo(); // todo
        }
        catch (error) {
            console.warn('*generatePlanets()', error);
        }
    }
    *generateOrbits() {
        const planetOrbits = new system_orbits_generator_1.SystemOrbitsGenerator({}, 
        // todo - when we generate from from existed system, we should use its model
        { star: this.getStarsModels()[0], seed: this.options.planetsSeed });
        for (const orbit of planetOrbits.generateOrbits())
            yield orbit;
    }
    toModel() {
        return super.toModel(Object.assign(Object.assign({}, this.model), { 
            // orbits: this.orbits.map((orbit) => orbit.toModel?.()),
            orbits: this.orbits, stars: this.stars.map((star) => star.toModel()), belts: this.belts.map((belt) => belt.toModel()), planets: this.planets.map((planet) => planet.toModel()), physic: Object.assign({}, this.physic), options: Object.assign({}, this.options) }));
    }
}
exports.SystemGenerator = SystemGenerator;
