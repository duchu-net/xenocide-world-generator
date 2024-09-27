import { Vector3 } from 'three';

import { RandomObject } from '../utils';

import { ShapeBase } from './shape.base';
import { Protostar } from './protostar';

type SphereShapeOptions = {
  size: number;
  densityMean: number;
  densityDeviation: number;
  deviationX: number;
  deviationY: number;
  deviationZ: number;
};

const defaultOptions: SphereShapeOptions = {
  size: 750,
  densityMean: 0.000001,
  densityDeviation: 0.0000001,
  deviationX: 0.35,
  deviationY: 0.125,
  deviationZ: 0.35,
};

export class Sphere implements ShapeBase {
  public readonly options: SphereShapeOptions;

  constructor(options?: Partial<SphereShapeOptions>) {
    this.options = { ...defaultOptions, ...options };
  }

  *Generate(random: RandomObject) {
    const { size, densityDeviation, densityMean, deviationX, deviationY, deviationZ } = this.options;
    const density = Math.max(0, random.NormallyDistributedSingle(densityDeviation, densityMean));
    const countMax = Math.max(0, parseInt((size * size * size * density).toFixed()));

    if (countMax <= 0) return;
    const count = random.Next(countMax);

    for (let i = 0; i < count; i++) {
      const pos = new Vector3(
        random.NormallyDistributedSingle(deviationX * size, 0),
        random.NormallyDistributedSingle(deviationY * size, 0),
        random.NormallyDistributedSingle(deviationZ * size, 0)
      );
      const d = pos.length() / size;
      const m = d * 2000 + (1 - d) * 15000;
      const t = random.NormallyDistributedSingle4(4000, m, 1000, 40000);

      yield new Protostar({
        position: pos,
        temperature: t,
      });
    }
  }
}
