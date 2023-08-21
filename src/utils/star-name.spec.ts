import { StarName } from './StarName';

describe('StarName - star-name.ts', () => {
  test('Greek returns a greek letter', () => {
    const result = StarName.Greek({ choice: jest.fn() } as any);
    expect(StarName.greekLetters).toContain(result);
  });

  test('Decorator returns a decorator', () => {
    const result = StarName.Decorator({ choice: jest.fn() } as any);
    expect(StarName.decorators).toContain(result);
  });

  test('RomanNumeral returns a roman numeral', () => {
    const result = StarName.RomanNumeral({
      NormallyDistributedSingle4: jest.fn(() => 1),
      unit: jest.fn(() => 0.9),
    } as any);
    expect(result).toBe('I');
  });

  test('Integer returns an integer', () => {
    const result = StarName.Integer({
      NormallyDistributedSingle4: jest.fn(() => 1),
    } as any);
    expect(Number.isInteger(result)).toBeTruthy();
  });

  test('Decimal returns a decimal', () => {
    const result = StarName.Decimal({
      NormallyDistributedSingle4: jest.fn(() => 1),
    } as any);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  test('Letter returns a letter', () => {
    const result = StarName.Letter({
      integer: jest.fn(() => 1),
    } as any);
    expect(typeof result).toBe('string');
    expect(result.length).toBe(1);
  });

  test('PlainMarkov returns a star name generated from MarkovModel', () => {
    StarName.instance = {
      Generate: jest.fn(() => 'star'),
    } as any;
    const result = StarName.PlainMarkov({} as any);
    expect(result).toBe('Star');
  });

  test('NamedStar returns a named star', () => {
    const names = ['Sirius', 'Betelgeuse', 'Vega'];
    const result = StarName.NamedStar({
      choice: jest.fn(() => 'Sirius'),
    } as any);
    expect(names).toContain(result);
  });

  test('WithDecoration returns a decorated star name', () => {
    const func = (random: any) => 'name';
    const result = StarName.WithDecoration(0.5, func)({} as any);
    expect(result).toBe('name');
  });
});
