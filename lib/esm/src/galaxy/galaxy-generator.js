import { Vector3 } from 'three';
import { Grid, Spiral } from '../galaxy-shape';
import { GalaxyClassShape } from '../interfaces';
import { capitalize, codename } from '../utils';
import { Names } from '../utils/Names';
import { StarName } from '../utils/StarName';
import { RandomGenerator } from './basic-generator';
import { StarPhysics } from './physic';
import { SystemGenerator } from './system';
const defaultOptions = {
    grid: { size: 100, spacing: 30 },
    spiral: { size: 400 },
};
export class GalaxyGenerator extends RandomGenerator {
    constructor(model, options = defaultOptions) {
        var _a;
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'GalaxyModel';
        this.systems = [];
        if (!model.name)
            this.model.name = capitalize(Names.GenerateGalaxyName(this.random)); // todo name generator should be static inside Galaxy?
        if (!model.id)
            this.model.id = codename(this.model.name);
        if (!model.path)
            this.model.path = codename(this.model.name);
        if (!model.position)
            this.model.position = new Vector3();
        // todo check that
        this.systems = ((_a = model.systems) === null || _a === void 0 ? void 0 : _a.map((system) => new SystemGenerator(system))) || [];
        this.setClassification();
    }
    setClassification(classification) {
        var _a;
        if (!this.model.classification) {
            const classificationT = (_a = this.random) === null || _a === void 0 ? void 0 : _a.choice(Object.values(GalaxyClassShape));
            this.model.classification = classification || classificationT;
        }
    }
    getShape() {
        switch (this.model.classification) {
            case 'spiral':
                return new Spiral(this.options.spiral);
            case 'grid':
            default:
                return new Grid(this.options.grid.size, this.options.grid.spacing);
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
            let systemName = StarName.Generate(this.random);
            while (this.systems.find((system) => {
                var _a;
                return ((_a = system.model.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == systemName.toLowerCase();
            }))
                systemName = StarName.Generate(this.random);
            const systemGenerator = new SystemGenerator({
                name: systemName,
                parentPath: this.model.path,
                position: system.position,
                temperature: system.temperature, // todo not needed?
            }, {
                seed: systemSeed,
                spectralClass: (_a = StarPhysics.getSpectralByTemperature(system.temperature)) === null || _a === void 0 ? void 0 : _a.class,
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
//# sourceMappingURL=galaxy-generator.js.map