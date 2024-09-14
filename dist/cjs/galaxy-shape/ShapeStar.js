"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeStar = void 0;
class ShapeStar {
    constructor(model) {
        this.position = model.position;
        this.temperature = model.temperature;
        this.galaxy_size = model.galaxy_size;
    }
    Offset(offset) {
        this.position.add(offset);
        return this;
    }
    swirl(axis, amount) {
        var d = this.position.length();
        var angle = Math.pow(d, 0.1) * amount;
        this.position.applyAxisAngle(axis, angle);
        return this;
    }
}
exports.ShapeStar = ShapeStar;
