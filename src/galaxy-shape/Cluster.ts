import { Vector3 } from 'three';
import { RandomObject } from '../utils';
import { ShapeBase } from './shape.base';

type ClusterShapeOptions = {
  countMean: number;
  countDeviation: number;
  deviationX: number;
  deviationY: number;
  deviationZ: number;
};

const defaultOptions: ClusterShapeOptions = {
  countMean: 0.0000025,
  countDeviation: 0.000001,
  deviationX: 0.0000025,
  deviationY: 0.0000025,
  deviationZ: 0.0000025,
};

export class Cluster implements ShapeBase {
  public readonly options: ClusterShapeOptions;

  constructor(public readonly basis: ShapeBase, options?: Partial<ClusterShapeOptions>) {
    this.options = { ...defaultOptions, ...options };
  }

  *Generate(random: RandomObject) {
    const { countMean, countDeviation, deviationX, deviationY, deviationZ } = this.options;

    try {
      const count = Math.max(0, random.NormallyDistributedSingle(countDeviation, countMean));
      if (count <= 0) return;

      for (let i = 0; i < count; i++) {
        const center = new Vector3(
          random.NormallyDistributedSingle(deviationX, 0),
          random.NormallyDistributedSingle(deviationY, 0),
          random.NormallyDistributedSingle(deviationZ, 0)
        );

        for (const star of this.basis.Generate(random)) yield star.offset(center);
      }
    } catch (err) {
      console.error('!', err);
    }
  }
}
