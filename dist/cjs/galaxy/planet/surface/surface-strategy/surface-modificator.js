"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceModificator = void 0;
class SurfaceModificator {
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
    generate(planet, random, options) {
        throw new Error('must be ovveride');
    }
}
exports.SurfaceModificator = SurfaceModificator;
