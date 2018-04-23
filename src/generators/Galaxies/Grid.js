import StarSystem from '../StarSystem'
import Names from '../Names'
// import Vector3 from '../../utils/Vector3'
import { Vector3 } from 'three'

class Grid {
  _size = null
  _spacing = null

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
          // yield {
          //   position: new Vector3(i * _spacing, j * _spacing, k * _spacing)
          //     .add(new Vector3(-_size/2, -_size/2, -_size/2)),
          //   temperature: null
          // }

          // const starSystem = StarSystem.Generate(random)
          //   .Position(new Vector3(i * _spacing, j * _spacing, k * _spacing))

          yield new StarSystem(
            null, { position: new Vector3(i * _spacing, j * _spacing, k * _spacing) },
            // ,StarName.Generate(random)
          )
            .Offset(new Vector3(-_size/2, -_size/2, -_size/2))
          // console.log('$',starSystem);
          // yield starSystem
        }
      }
    }
  }

  * GenerateShape(random) {
    const { _size, _spacing } = this
    const count = (_size / _spacing).toFixed()

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          yield {
            position: new Vector3(i * _spacing, j * _spacing, k * _spacing)
              .add(new Vector3(-_size/2, -_size/2, -_size/2)),
            temperature: null,
            galaxy_size: _size,
          }
        }
      }
    }
  }
}

export default Grid
