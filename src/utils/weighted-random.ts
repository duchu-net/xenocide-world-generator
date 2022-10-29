function getTotal(weights: number[]) {
  return weights.reduce((prev, curr) => prev + curr, 0);
}

export function randomWeighted(args: any[], options: { rand: any; parse: any; total: any; normal: any }) {
  if (typeof options.rand !== 'function') {
    options.rand = Math.random;
  }
  if (typeof options.parse !== 'function') {
    options.parse = (x: number) => x;
  }
  // if (set.length !== weights.length) {
  //   throw new TypeError('Different number of options & weights.')
  // }

  const weights = Object.values(args);
  const set = Object.keys(args);

  const total = options.total || (options.normal ? 1 : getTotal(weights));
  let key = options.rand() * total;

  // if (typeof args === 'object') {
  //
  // }

  for (let index = 0; index < weights.length; index++) {
    key -= weights[index];
    if (key < 0) return options.parse(set[index]);
  }

  throw new RangeError('All weights do not add up to >= 1 as expected.');
}

export default randomWeighted;