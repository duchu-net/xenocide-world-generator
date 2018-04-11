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

  Next(max) {
    if (max != null) return this._random.integer(0, max)
    return this._random.next()
  }

  NormallyDistributedSingle(standardDeviation, mean) {
    const random = this._random
    // *****************************************************
    // Intentionally duplicated to avoid IEnumerable overhead
    // *****************************************************
    // var u1 = random.NextDouble() //these are uniform(0,1) random doubles
    // var u2 = random.NextDouble()
    var u1 = random.unit() //these are uniform(0,1) random doubles
    var u2 = random.unit()
    // console.log('@@', u1, u2);

    var x1 = Math.sqrt(-2.0 * Math.log(u1))
    var x2 = 2.0 * Math.PI * u2;
    var z1 = x1 * Math.sin(x2) //random normal(0,1)
    return z1 * standardDeviation + mean
  }
}

export default RandomObject
