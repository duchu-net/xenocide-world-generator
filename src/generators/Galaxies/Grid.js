import { Vector3 } from 'three-math'
import ShapeStar from './ShapeStar'

class Grid {
  constructor(size, spacing) {
    this._size = size || 5
    this._spacing = spacing || 1
  }

  * Generate(random) {
    const { _size, _spacing } = this
    const count = (_size / _spacing).toFixed()

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          yield new ShapeStar({
            position: new Vector3(i * _spacing, j * _spacing, k * _spacing),
            // .add(new Vector3(-_size/2, -_size/2, -_size/2)),
            temperature: null,
            galaxy_size: _size,
          }).Offset(new Vector3(-_size/2, -_size/2, -_size/2))
        }
      }
    }
  }
}

export default Grid
