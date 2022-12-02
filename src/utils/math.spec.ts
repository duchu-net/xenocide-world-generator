import { truncDecimals } from './math';

describe('word-generator util math.ts', () => {
  it('truncDecimals should work', () => {
    expect(truncDecimals(4.27, 2)).toEqual(4.27)
    expect(truncDecimals(4.21, 2)).toEqual(4.21)
    expect(truncDecimals(4.29, 2)).toEqual(4.29)
    expect(truncDecimals(0.000000199, 2)).toEqual(0);
    expect(truncDecimals(0.99999999, 3)).toEqual(0.999);
    expect(truncDecimals(15.99999999, 1)).toEqual(15.9);
    expect(truncDecimals(4.9999, 3)).toEqual(4.999);
    expect(truncDecimals(-15.7784514, 1)).toEqual(-15.7);
    expect(truncDecimals(-15.7784514, 2)).toEqual(-15.77);
    expect(truncDecimals(-15.7784514, 3)).toEqual(-15.778);
  });
});
