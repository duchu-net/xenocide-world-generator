import { Vector3 } from 'three';
import { ShapeStar } from './ShapeStar';
export class Sphere {
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
            var pos = new Vector3(random.NormallyDistributedSingle(deviationX * size, 0), random.NormallyDistributedSingle(deviationY * size, 0), random.NormallyDistributedSingle(deviationZ * size, 0));
            var d = pos.length() / size;
            var m = d * 2000 + (1 - d) * 15000;
            var t = random.NormallyDistributedSingle4(4000, m, 1000, 40000);
            yield new ShapeStar({
                // name: StarName.Generate(random),
                position: pos,
                temperature: t,
            });
        }
    }
}
//# sourceMappingURL=Sphere.js.map