"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const three_1 = require("three");
const ShapeStar_1 = require("./ShapeStar");
class Grid {
    constructor(size = 5, spacing = 1) {
        this.size = size;
        this.spacing = spacing;
    }
    *Generate(random) {
        const { size, spacing } = this;
        const count = parseInt((size / spacing).toFixed());
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                for (let k = 0; k < count; k++) {
                    yield new ShapeStar_1.ShapeStar({
                        position: new three_1.Vector3(i * spacing, j * spacing, k * spacing),
                        // .add(new Vector3(-size/2, -size/2, -size/2)),
                        // temperature: null,
                        galaxy_size: size,
                    }).Offset(new three_1.Vector3(-size / 2, -size / 2, -size / 2));
                }
            }
        }
    }
}
exports.Grid = Grid;
