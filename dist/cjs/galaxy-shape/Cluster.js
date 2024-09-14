"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const three_1 = require("three");
class Cluster {
    constructor(basis, countMean = 0.0000025, countDeviation = 0.000001, deviationX = 0.0000025, deviationY = 0.0000025, deviationZ = 0.0000025) {
        this.basis = basis;
        this.countMean = countMean;
        this.countDeviation = countDeviation;
        this.deviationX = deviationX;
        this.deviationY = deviationY;
        this.deviationZ = deviationZ;
    }
    *Generate(random) {
        const { basis, 
        // size,
        countDeviation, countMean, deviationX, deviationY, deviationZ, } = this;
        try {
            const count = Math.max(0, random.NormallyDistributedSingle(countDeviation, countMean));
            if (count <= 0)
                return;
            for (let i = 0; i < count; i++) {
                const center = new three_1.Vector3(random.NormallyDistributedSingle(deviationX, 0), random.NormallyDistributedSingle(deviationY, 0), random.NormallyDistributedSingle(deviationZ, 0));
                for (const star of basis.Generate(random))
                    yield star.Offset(center);
            }
        }
        catch (err) {
            console.error('!', err);
        }
    }
}
exports.Cluster = Cluster;
