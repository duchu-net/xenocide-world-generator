// import Vector3 from '../../utils/Vector3'
import { Vector3 } from 'three'
import StarSystem from '../StarSystem'

class Sphere {
  constructor(size, densityMean, densityDeviation, deviationX, deviationY, deviationZ) {
    this._size = size || 10;

    this._densityMean = densityMean || 0.0000025;
    this._densityDeviation = densityDeviation || 0.000001;

    this._deviationX = deviationX || 0.0000025;
    this._deviationY = deviationY || 0.0000025;
    this._deviationZ = deviationZ || 0.0000025;
  }

  * Generate(random) {
    const {
      _size,
      _densityDeviation,
      _densityMean,
      _deviationX,
      _deviationY,
      _deviationZ
    } = this
    const density = Math.max(0, random.NormallyDistributedSingle(_densityDeviation, _densityMean));
    // console.log('density', density, random.NormallyDistributedSingle(_densityDeviation, _densityMean));
    const countMax = Math.max(0, parseInt(_size * _size * _size * density))

    if (countMax <= 0) return
    var count = random.Next(countMax)
    // console.log(countMax, count);

    for (let i=0; i<count; i++) {
      var pos = new Vector3(
        random.NormallyDistributedSingle(_deviationX * _size, 0),
        random.NormallyDistributedSingle(_deviationY * _size, 0),
        random.NormallyDistributedSingle(_deviationZ * _size, 0)
      )
      var d = pos.length() / _size;
      var m = d * 2000 + (1 - d) * 15000;
      var t = random.NormallyDistributedSingle4(4000, m, 1000, 40000)
      // console.log('@@', t); //temperature
      yield new StarSystem(pos)
    //
    //   yield return new Star(
    //     pos,
    //     StarName.Generate(random),
    //     t
    //   );
    }
  }
}

export default Sphere
