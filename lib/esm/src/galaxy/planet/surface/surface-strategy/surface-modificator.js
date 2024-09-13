export class SurfaceModificator {
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
    generate(planet, random, options) {
        throw new Error('must be ovveride');
    }
}
//# sourceMappingURL=surface-modificator.js.map