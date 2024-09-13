"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sphere = void 0;
const three_1 = require("three");
const ShapeStar_1 = require("./ShapeStar");
class Sphere {
    constructor(size = 750, densityMean = 0.000001, densityDeviation = 0.0000001, deviationX = 0.35, deviationY = 0.125, deviationZ = 0.35) {
        this.size = size;
        this.densityMean = densityMean;
        this.densityDeviation = densityDeviation;
        this.deviationX = deviationX;
        this.deviationY = deviationY;
        this.deviationZ = deviationZ;
    }
    *Generate(random) {
        const { size, densityDeviation, densityMean, deviationX, deviationY, deviationZ } = this;
        const density = Math.max(0, random.NormallyDistributedSingle(densityDeviation, densityMean));
        const countMax = Math.max(0, parseInt((size * size * size * density).toFixed()));
        if (countMax <= 0)
            return;
        var count = random.Next(countMax);
        for (let i = 0; i < count; i++) {
            var pos = new three_1.Vector3(random.NormallyDistributedSingle(deviationX * size, 0), random.NormallyDistributedSingle(deviationY * size, 0), random.NormallyDistributedSingle(deviationZ * size, 0));
            var d = pos.length() / size;
            var m = d * 2000 + (1 - d) * 15000;
            var t = random.NormallyDistributedSingle4(4000, m, 1000, 40000);
            yield new ShapeStar_1.ShapeStar({
                // name: StarName.Generate(random),
                position: pos,
                temperature: t,
            });
        }
    }
}
exports.Sphere = Sphere;
//# sourceMappingURL=Sphere.js.map