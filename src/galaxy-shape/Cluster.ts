import { Vector3 } from 'three';
import { RandomObject } from '../utils';
import { BasicShape } from './BasicShape';

export class Cluster implements BasicShape {
  constructor(
    public readonly basis: BasicShape,
    public readonly countMean = 0.0000025,
    public readonly countDeviation = 0.000001,
    public readonly deviationX = 0.0000025,
    public readonly deviationY = 0.0000025,
    public readonly deviationZ = 0.0000025
  ) {}

  *Generate(random: RandomObject) {
    const {
      basis,
      // size,
      countDeviation,
      countMean,
      deviationX,
      deviationY,
      deviationZ,
    } = this;

    try {
      const count = Math.max(0, random.NormallyDistributedSingle(countDeviation, countMean));
      if (count <= 0) return;

      for (let i = 0; i < count; i++) {
        const center = new Vector3(
          random.NormallyDistributedSingle(deviationX, 0),
          random.NormallyDistributedSingle(deviationY, 0),
          random.NormallyDistributedSingle(deviationZ, 0)
        );

        for (const star of basis.Generate(random)) yield star.Offset(center);
      }
    } catch (err) {
      console.error('!', err);
    }
  }
}
