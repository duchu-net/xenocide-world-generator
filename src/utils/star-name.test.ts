import { StarName } from './StarName';

describe('StarName - star-name.ts', () => {
  it('Greek returns a greek letter', () => {
    const result = StarName.Greek({ choice: jest.fn(() => 'Epsilon') } as any);
    expect(StarName.greekLetters).toContain(result);
  });

  it('Decorator returns a decorator', () => {
    const result = StarName.Decorator({ choice: jest.fn(() => 'Minor') } as any);
    expect(StarName.decorators).toContain(result);
  });

  it('RomanNumeral returns a roman numeral', () => {
    const result = StarName.RomanNumeral({
      NormallyDistributedSingle4: jest.fn(() => 1),
      unit: jest.fn(() => 0.9),
    } as any);
    expect(result).toBe('I');
  });

  it('Integer returns an integer', () => {
    const result = StarName.Integer({
      NormallyDistributedSingle4: jest.fn(() => 1),
    } as any);
    expect(Number.isInteger(result)).toBeTruthy();
  });

  it('Decimal returns a decimal', () => {
    const result = StarName.Decimal({
      NormallyDistributedSingle4: jest.fn(() => 1),
    } as any);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('Letter returns a letter', () => {
    const result = StarName.Letter({
      integer: jest.fn(() => 1),
    } as any);
    expect(typeof result).toBe('string');
    expect(result.length).toBe(1);
  });

  it('PlainMarkov returns a star name generated from MarkovModel', () => {
    StarName.instance = {
      Generate: jest.fn(() => 'star'),
    } as any;
    const result = StarName.PlainMarkov({} as any);
    expect(result).toBe('Star');
  });

  it('NamedStar returns a named star', () => {
    const names = ['Sirius', 'Betelgeuse', 'Vega'];
    const result = StarName.NamedStar({
      choice: jest.fn(() => 'Sirius'),
    } as any);
    expect(names).toContain(result);
  });
});
