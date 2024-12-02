type Component = number | string;

export class XorShift128 {
  private x: number;
  private y: number;
  private z: number;
  private w: number;

  constructor(x?: Component, y?: Component, z?: Component, w?: Component) {
    this.x = x ? (x as number) >>> 0 : 123456789;
    this.y = y ? (y as number) >>> 0 : 362436069;
    this.z = z ? (z as number) >>> 0 : 521288629;
    this.w = w ? (w as number) >>> 0 : 88675123;
  }

  next() {
    var t = this.x ^ ((this.x << 11) & 0x7fffffff);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = this.w ^ (this.w >> 19) ^ (t ^ (t >> 8));
    return this.w;
  }

  unit() {
    return this.next() / 0x80000000;
  }

  unitInclusive() {
    return this.next() / 0x7fffffff;
  }

  integer(min: number, max: number) {
    return this.integerExclusive(min, max + 1);
  }

  integerExclusive(min: number, max: number) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(this.unit() * (max - min)) + min;
  }

  real(min: number, max: number) {
    return this.unit() * (max - min) + min;
  }

  realInclusive(min: number, max: number) {
    return this.unitInclusive() * (max - min) + min;
  }

  reseed(x: Component, y: Component, z: Component, w: Component) {
    this.x = x ? (x as number) >>> 0 : 123456789;
    this.y = y ? (y as number) >>> 0 : 362436069;
    this.z = z ? (z as number) >>> 0 : 521288629;
    this.w = w ? (w as number) >>> 0 : 88675123;
  }
}
