import { Vector3 } from 'three-math'

class Cluster {
  constructor(basis, countMean, countDeviation, deviationX, deviationY, deviationZ) {
    // this._size = size || 10;
    this._basis = basis

    this._countMean = countMean || 0.0000025
    this._countDeviation = countDeviation || 0.000001

    this._deviationX = deviationX || 0.0000025
    this._deviationY = deviationY || 0.0000025
    this._deviationZ = deviationZ || 0.0000025
  }

  * Generate(random) {
    const {
      _basis,
      // _size,
      _countDeviation,
      _countMean,
      _deviationX,
      _deviationY,
      _deviationZ
    } = this

    try {
      var count = Math.max(0, random.NormallyDistributedSingle(_countDeviation, _countMean))
      if (count <= 0) return
      // if (count <= 0) yield

      for (let i=0; i<count; i++) {
        const center = new Vector3(
          random.NormallyDistributedSingle(_deviationX, 0),
          random.NormallyDistributedSingle(_deviationY, 0),
          random.NormallyDistributedSingle(_deviationZ, 0)
        )

        for (const star of _basis.Generate(random))
          yield star.Offset(center)
      }
    } catch(err) {
      console.error('!', err)
    }
  }
}

export default Cluster
