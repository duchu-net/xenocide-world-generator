// @ts-nocheck
import XorShift128 from './XorShift128';

export class RandomObject {
  _random: XorShift128;
  get random() {
    return this._random;
  }
  set random(rand: XorShift128) {
    this._random = rand;
  }

  constructor(random) {
    if (random == null) {
      this.random = new XorShift128();
      return this;
    }
    switch (typeof random) {
      case 'object':
        this.random = random;
        break;
      case 'number':
      case 'string':
        this.random = new XorShift128(random);
        break;
      default:
        this.random = new XorShift128();
    }
    // this._random = random || new XorShift128(254158958941485)
  }

  choice(list) {
    if (!Array.isArray(list)) throw new TypeError('list must by an array');
    // console.log('@',this.next(list.length), list[this.next(list.length)]);
    return list[this.next(list.length - 1)];
  }

  weighted(list: [] | {}) {
    // weighted<T>(list: T[] | {}): T[1] {
    if (typeof list !== 'object') throw new TypeError('list must be array or object');
    if (!Array.isArray(list)) {
      list = Object.entries(list).map((e) => [e[1], e[0]]);
    }

    const sum = list.reduce((o, c) => (o += c[0]), 0);
    let num = this.random.real(0, sum);
    // console.log(sum, num)
    for (let i = 0; i < list.length; i++) {
      num -= list[i][0];
      if (num < 0) return list[i][1];
    }
  }

  Next(max?: number) {
    return this.next(max);
  }
  next(max?: number) {
    if (max != null) return this.random.integer(0, max);
    return this.random.next();
  }
  unit() {
    return this.random.unit();
  }
  integer(min: number, max: number) {
    return this.random.integer(min, max);
  }
  integerExclusive(min: number, max: number) {
    return this.random.integerExclusive(min, max);
  }
  real(min: number, max: number) {
    return this.random.real(min, max);
  }
  realInclusive(min: number, max: number) {
    return this.random.realInclusive(min, max);
  }
  seed() {
    return this.next();
  }

  NormallyDistributedSingle(standardDeviation: number, mean: number) {
    // *****************************************************
    // Intentionally duplicated to avoid IEnumerable overhead
    // *****************************************************
    // var u1 = random.NextDouble() //these are uniform(0,1) random doubles
    // var u2 = random.NextDouble()
    const u1 = this.random.unit(); //these are uniform(0,1) random doubles
    const u2 = this.random.unit();
    // console.log('@@', u1, u2);

    const x1 = Math.sqrt(-2.0 * Math.log(u1));
    const x2 = 2.0 * Math.PI * u2;
    const z1 = x1 * Math.sin(x2); //random normal(0,1)
    return z1 * standardDeviation + mean;
  }

  NormallyDistributedSingle4(standardDeviation: number, mean: number, min: number, max: number) {
    const nMax = (max - mean) / standardDeviation;
    const nMin = (min - mean) / standardDeviation;
    const nRange = nMax - nMin;
    const nMaxSq = nMax * nMax;
    const nMinSq = nMin * nMin;
    let subFrom = nMinSq;
    if (nMin < 0 && 0 < nMax) subFrom = 0;
    else if (nMax < 0) subFrom = nMaxSq;

    let sigma = 0.0;
    let u;
    let z;
    do {
      z = nRange * this.unit() + nMin; // uniform[normMin, normMax]
      sigma = Math.exp((subFrom - z * z) / 2);
      u = this.unit();
    } while (u > sigma);

    return z * standardDeviation + mean;
  }

  static randomSeed() {
    return Math.floor(new Date().getTime() / Math.floor(Math.random() * 100 + 1));
  }
}

export default RandomObject;
