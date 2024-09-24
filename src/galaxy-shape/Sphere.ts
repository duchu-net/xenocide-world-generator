import { Vector3 } from 'three';

import { RandomObject } from '../utils';

import { ShapeBase } from './shape.base';
import { StarEssential } from './star-essential';

export class Sphere implements ShapeBase {
  constructor(
    public readonly size: number = 750,
    public readonly densityMean: number = 0.000001,
    public readonly densityDeviation: number = 0.0000001,
    public readonly deviationX: number = 0.35,
    public readonly deviationY: number = 0.125,
    public readonly deviationZ: number = 0.35
  ) {}

  *Generate(random: RandomObject) {
    const { size, densityDeviation, densityMean, deviationX, deviationY, deviationZ } = this;
    const density = Math.max(0, random.NormallyDistributedSingle(densityDeviation, densityMean));
    const countMax = Math.max(0, parseInt((size * size * size * density).toFixed()));

    if (countMax <= 0) return;
    var count = random.Next(countMax);

    for (let i = 0; i < count; i++) {
      var pos = new Vector3(
        random.NormallyDistributedSingle(deviationX * size, 0),
        random.NormallyDistributedSingle(deviationY * size, 0),
        random.NormallyDistributedSingle(deviationZ * size, 0)
      );
      var d = pos.length() / size;
      var m = d * 2000 + (1 - d) * 15000;
      var t = random.NormallyDistributedSingle4(4000, m, 1000, 40000);

      yield new StarEssential({
        // name: StarName.Generate(random),
        position: pos,
        temperature: t,
      });
    }
  }
}
