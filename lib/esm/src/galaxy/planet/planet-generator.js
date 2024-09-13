var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { codename, decimalToRoman } from '../../utils';
import { RandomGenerator } from '../basic-generator';
import { PlanetPhysic } from '../physic';
import { PlanetSurfaceGenerator } from './surface/planet-surface-generator';
const defaultOptions = {
    seed: 0,
    surfaceSeed: 0,
    // position: new Vector3(0, 0, 0),
};
// export interface PlanetGeneratorModel {
//   model?: PlanetModel;
//   options?: PlanetOptions;
// }
export class PlanetGenerator extends RandomGenerator {
    constructor(model, options = defaultOptions) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'PlanetModel';
        this.physic = {
            mass: 0,
            density: 0,
            radius: 0,
            rotationPeriod: 0,
            obliquity: 0,
        };
        if (!this.options.surfaceSeed)
            this.options.surfaceSeed = this.random.seed();
        if (!model.id)
            this.model.id = codename(this.model.name);
        if (!model.path)
            this.model.path = `${this.model.parentPath}/p:${this.model.id}`;
        this.regions = model.regions || [];
        const type = model.type || options.planetType;
        if (type) {
            this.meta = PlanetPhysic.getClass(type);
        }
        else {
            const availableClasses = PlanetPhysic.PLANET_CLASSIFICATION.filter((planetTopology) => { var _a; return planetTopology.when((_a = this.options.star) === null || _a === void 0 ? void 0 : _a.physic, this.model.orbit); });
            this.meta = this.random.weighted(availableClasses.map((top) => [top.probability, top]));
        }
        this.model.type = this.meta.class;
        this.model.subType = this.meta.subClass;
        this.model.radius = this.model.radius || this.random.real(this.meta.radius[0], this.meta.radius[1]);
        // this.generateTopology();
        this.initializePhysic();
    }
    initializePhysic() {
        var _a;
        const { model, physic, options } = this;
        // Object.assign(physic, options.orbit);
        physic.radius = model.radius || physic.radius;
        // physic.mass = model.mass || physic.mass;
        physic.mass = 1;
        physic.rotationPeriod = PlanetPhysic.calcRotationalPeriod(physic.mass, physic.radius, ((_a = model.orbit) === null || _a === void 0 ? void 0 : _a.distance) || 1);
    }
    get subtype() {
        // @ts-ignore
        return this.model.subtype;
    }
    *generateSurface() {
        try {
            const surface = new PlanetSurfaceGenerator({}, { strategyName: this.model.type, seed: this.options.surfaceSeed });
            surface.generateSurface();
            this.regions = surface.planet.topology.tiles.map((tile) => ({
                id: tile.id.toString(),
                path: `${this.model.path}/r:${tile.id.toString()}`,
                biome: tile.biome,
                color: tile.color ? `#${tile.color.getHexString()}` : this.meta.color[0],
                corners: tile.corners.map((corner) => corner.position),
                neighbors: tile.tiles.map((tile) => tile.id.toString()),
            }));
            // for (const region of surface.generateSurface()) {
            //   yield region;
            // }
            for (let index = 0; index < this.regions.length; index++) {
                yield this.regions[index];
            }
        }
        catch (error) {
            console.warn('*generateSurface()', error);
        }
    }
    static getSequentialName(systemName, planetIndex) {
        return `${systemName} ${decimalToRoman(planetIndex + 1)}`;
    }
    toModel() {
        const _a = this.options, { star } = _a, options = __rest(_a, ["star"]);
        return super.toModel(Object.assign(Object.assign({}, this.model), { regions: this.regions, physic: Object.assign({}, this.physic), options: Object.assign({}, options) }));
    }
}
//# sourceMappingURL=planet-generator.js.map