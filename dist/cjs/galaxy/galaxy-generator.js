"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalaxyGenerator = void 0;
const three_1 = require("three");
const galaxy_shape_1 = require("../galaxy-shape");
const interfaces_1 = require("../interfaces");
const utils_1 = require("../utils");
const Names_1 = require("../utils/Names");
const StarName_1 = require("../utils/StarName");
const basic_generator_1 = require("./basic-generator");
const physic_1 = require("./physic");
const system_1 = require("./system");
const defaultOptions = {
    grid: { size: 100, spacing: 30 },
    spiral: { size: 400 },
};
class GalaxyGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options = defaultOptions) {
        var _a;
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'GalaxyModel';
        this.systems = [];
        if (!model.name)
            this.model.name = (0, utils_1.capitalize)(Names_1.Names.GenerateGalaxyName(this.random)); // todo name generator should be static inside Galaxy?
        if (!model.id)
            this.model.id = (0, utils_1.codename)(this.model.name);
        if (!model.path)
            this.model.path = (0, utils_1.codename)(this.model.name);
        if (!model.position)
            this.model.position = new three_1.Vector3();
        // todo check that
        this.systems = ((_a = model.systems) === null || _a === void 0 ? void 0 : _a.map((system) => new system_1.SystemGenerator(system))) || [];
        this.setClassification();
    }
    setClassification(classification) {
        var _a;
        if (!this.model.classification) {
            const classificationT = (_a = this.random) === null || _a === void 0 ? void 0 : _a.choice(Object.values(interfaces_1.GalaxyClassShape));
            this.model.classification = classification || classificationT;
        }
    }
    getShape() {
        switch (this.model.classification) {
            case 'spiral':
                return new galaxy_shape_1.Spiral(this.options.spiral);
            case 'grid':
            default:
                return new galaxy_shape_1.Grid(this.options.grid.size, this.options.grid.spacing);
        }
    }
    *generateSystems() {
        var _a;
        const shape = this.getShape();
        for (const system of shape.Generate(this.random)) {
            // CHECK UNIQUE SEED
            let systemSeed = this.random.next();
            while (this.systems.find((system) => system.options.seed == systemSeed))
                systemSeed = this.random.next();
            let systemName = StarName_1.StarName.Generate(this.random);
            while (this.systems.find((system) => {
                var _a;
                return ((_a = system.model.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == systemName.toLowerCase();
            }))
                systemName = StarName_1.StarName.Generate(this.random);
            const systemGenerator = new system_1.SystemGenerator({
                name: systemName,
                parentPath: this.model.path,
                position: system.position,
                temperature: system.temperature, // todo not needed?
            }, {
                seed: systemSeed,
                spectralClass: (_a = physic_1.StarPhysics.getSpectralByTemperature(system.temperature)) === null || _a === void 0 ? void 0 : _a.class,
            });
            this.systems.push(systemGenerator);
            yield systemGenerator;
        }
        // this.fillStatistics();
    }
    toModel() {
        // @ts-ignore
        return Object.assign(Object.assign({}, this.model), { options: this.options, systems: this.systems.map((system) => system.toModel()) });
    }
}
exports.GalaxyGenerator = GalaxyGenerator;
