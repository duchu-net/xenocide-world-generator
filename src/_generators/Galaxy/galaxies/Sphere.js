import * as THREE from 'three'


class Sphere {
  // : BaseGalaxySpec
  _size;
  _densityMean;
  _densityDeviation;

  _deviationX;
  _deviationY;
  _deviationZ;

  constructor(
    size,
    densityMean = 0.0000025,
    densityDeviation = 0.000001,
    deviationX = 0.0000025,
    deviationY = 0.0000025,
    deviationZ = 0.0000025
  ) {
    this._size = size;

    this._densityMean = densityMean;
    this._densityDeviation = densityDeviation;

    this._deviationX = deviationX;
    this._deviationY = deviationY;
    this._deviationZ = deviationZ;
  }

  generate(random) {
    const { _size } = this
    const density = Math.max(0, random.NormallyDistributedSingle(this._densityDeviation, this._densityMean));
    const countMax = Math.max(0, (int)(_size * _size * _size * density));

    if (countMax <= 0) {
      // yield break;
    }

    const count = random.Next(countMax);

    for (let i = 0; i < count; i++) {
//                var pos = new Vector3(
//                    random.NormallyDistributedSingle(_deviationX * _size, 0),
//                    random.NormallyDistributedSingle(_deviationY * _size, 0),
//                    random.NormallyDistributedSingle(_deviationZ * _size, 0)
//                );
//                var d = pos.Length() / _size;
//                var m = d * 2000 + (1 - d) * 15000;
//                var t = random.NormallyDistributedSingle(4000, m, 1000, 40000);
//
//                yield return new Star(
//                    pos,
//                    StarName.Generate(random),
//                    t
//                );
    }
  }
}

export default Sphere
