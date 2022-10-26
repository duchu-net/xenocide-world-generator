import { Vector3 } from 'three';

import { RandomObject } from '../../utils';

import { ShapeStar } from './ShapeStar';

export class Grid {
  constructor(public readonly size: number = 5, public readonly spacing: number = 1) {}

  *Generate(random: RandomObject) {
    const { size, spacing } = this;
    const count = parseInt((size / spacing).toFixed());

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          yield new ShapeStar({
            position: new Vector3(i * spacing, j * spacing, k * spacing),
            // .add(new Vector3(-size/2, -size/2, -size/2)),
            // temperature: null,
            galaxy_size: size,
          }).Offset(new Vector3(-size / 2, -size / 2, -size / 2));
        }
      }
    }
  }
}
