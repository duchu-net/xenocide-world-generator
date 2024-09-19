import RandomObject from './random-object';

/**
 * `npx nx run world-generator:test --testFile=random-object.test.ts`
 */
describe('RandomObject', () => {
  let randomObject: RandomObject;

  beforeEach(() => {
    randomObject = new RandomObject(123456789);
  });

  it('should generate same numbers on same seed', () => {
    const rand2 = new RandomObject(123456789);
    const arr1 = Array.from({ length: 500 }, () => randomObject.next());
    const arr2 = Array.from({ length: 500 }, () => rand2.next());
    expect(arr1).toEqual(arr2);
  });
  it('should generate different numbers on different seed', () => {
    const rand2 = new RandomObject(987654321);
    const arr1 = Array.from({ length: 500 }, () => randomObject.next());
    const arr2 = Array.from({ length: 500 }, () => rand2.next());
    expect(arr1).not.toEqual(arr2);
  });

  it('should generate a random number between 0 and 10', () => {
    const randomNumber = randomObject.next(10);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(10);
  });

  it('should generate a random integer between 1 and 100', () => {
    const randomInteger = randomObject.integer(1, 100);
    expect(randomInteger).toBeGreaterThanOrEqual(1);
    expect(randomInteger).toBeLessThanOrEqual(100);
    expect(Number.isInteger(randomInteger)).toBe(true);
  });

  it('should generate a random real number between 0 and 1', () => {
    const randomReal = randomObject.real(0, 1);
    expect(randomReal).toBeGreaterThanOrEqual(0);
    expect(randomReal).toBeLessThanOrEqual(1);
  });

  it('should choose a random element from an array', () => {
    const list = ['apple', 'banana', 'orange'];
    const randomChoice = randomObject.choice(list);
    expect(list).toContain(randomChoice);
  });

  it('should choose a random element from an object with weighted probabilities', () => {
    const weightedList = { apple: 0.5, banana: 0.3, orange: 0.2 };
    const randomWeighted = randomObject.weighted(weightedList);
    expect(Object.keys(weightedList)).toContain(randomWeighted);
  });
});
