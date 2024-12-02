import { Vector3 } from 'three';

import { RandomObject } from '../utils';
import { ShapeBase } from './shape.base';
import { Protostar } from './protostar';

export type GridShapeOptions = {
  size: number;
  spacing: number;
};

const defaultOptions: GridShapeOptions = {
  size: 5,
  spacing: 1,
};

export class Grid implements ShapeBase {
  public readonly options: GridShapeOptions;

  constructor(options?: Partial<GridShapeOptions>) {
    this.options = { ...defaultOptions, ...options };
  }

  *Generate(random?: RandomObject) {
    const { size, spacing } = this.options;
    const count = parseInt((size / spacing).toFixed());

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          yield new Protostar({
            position: new Vector3(i * spacing, j * spacing, k * spacing),
            // .add(new Vector3(-size/2, -size/2, -size/2)),
            galaxy_size: size,
          }).offset(new Vector3(-size / 2, -size / 2, -size / 2));
        }
      }
    }
  }
}
