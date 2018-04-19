import { randomInt } from './random'
import XorShift128 from './XorShift128'

class RandomObject {
  get random() { return this._random }
  set random(rand) {
    this._random = rand
  }

  constructor(random) {
    switch (typeof random) {
      case 'object': this.random = random; break
      case 'number':
      case 'string': this.random = new XorShift128(random); break
      default: this.random = new XorShift128()
    }
    // this._random = random || new XorShift128(254158958941485)
  }

  choice(list) {
    if (!Array.isArray(list)) throw new TypeError('list must by an array')
    // console.log('@',this.next(list.length), list[this.next(list.length)]);
    return list[this.next(list.length-1)]
  }
  weighted(list) {
    // TODO - now return randomly xD
    if (typeof list !== 'object') throw new TypeError('list must be array or object')
    if (!Array.isArray(list)) {
      list = Object.entries(list).map(e => ([e[1], e[0]]))
    }
    return this.choice(list)[1]
  }

  Next(max) { return this.next(max) }
  next(max) {
    if (max != null) return this.random.integer(0, max)
    return this.random.next()
  }
  unit() { return this.random.unit() }
  integer(min, max) { return this.random.integer(min, max) }
  real(min, max) { return this.random.real(min, max) }
  seed() { return this.next() }

  NormallyDistributedSingle(standardDeviation, mean) {
    // *****************************************************
    // Intentionally duplicated to avoid IEnumerable overhead
    // *****************************************************
    // var u1 = random.NextDouble() //these are uniform(0,1) random doubles
    // var u2 = random.NextDouble()
    var u1 = this.random.unit() //these are uniform(0,1) random doubles
    var u2 = this.random.unit()
    // console.log('@@', u1, u2);

    var x1 = Math.sqrt(-2.0 * Math.log(u1))
    var x2 = 2.0 * Math.PI * u2;
    var z1 = x1 * Math.sin(x2) //random normal(0,1)
    return z1 * standardDeviation + mean
  }

  NormallyDistributedSingle4(standardDeviation, mean, min, max) {
      var nMax = (max - mean) / standardDeviation;
      var nMin = (min - mean) / standardDeviation;
      var nRange = nMax - nMin;
      var nMaxSq = nMax * nMax;
      var nMinSq = nMin * nMin;
      var subFrom = nMinSq;
      if (nMin < 0 && 0 < nMax) subFrom = 0;
      else if (nMax < 0) subFrom = nMaxSq;

      var sigma = 0.0;
      let u;
      let z;
      do {
        z = nRange * this.unit() + nMin; // uniform[normMin, normMax]
        sigma = Math.exp((subFrom - z * z) / 2);
        u = this.unit();
      } while (u > sigma);

      return z * standardDeviation + mean;
  }
}

export default RandomObject
