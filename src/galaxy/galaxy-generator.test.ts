import { GalaxyGenerator } from './galaxy-generator';

/**
 * nx run world-generator:test --testFile=libs\world-generator\src\galaxy\galaxy-generator.test.ts
 */
describe('world-generator galaxy-generator.ts', () => {
  it('should generate galaxy', () => {
    const galaxy = new GalaxyGenerator({});
    expect(galaxy instanceof GalaxyGenerator).toBeTruthy();

    let count = 0;
    for (const system of galaxy.generateSystems()) {
      count++;
    }
    expect(galaxy.systems.length).toBeTruthy();
    expect(galaxy.systems).toHaveLength(count);
  });
});
