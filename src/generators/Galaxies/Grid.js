import StarSystem from '../StarSystem'
// import Vector3 from '../../utils/Vector3'
import { Vector3 } from 'three'

class Grid {
  _size = null
  _spacing = null

  constructor(size, spacing) {
    this._size = size || 10
    this._spacing = spacing || 1
  }

  * Generate(random) {
    const { _size, _spacing } = this
    const count = (_size / _spacing).toFixed()

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          yield new StarSystem(
            new Vector3(i * _spacing, j * _spacing, k * _spacing)
            // ,StarName.Generate(random)
          )
            .Offset(new Vector3(-_size/2, -_size/2, -_size/2))
        }
      }
    }
  }
}

export default Grid
