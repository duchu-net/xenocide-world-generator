import { SystemGenerator } from './system-generator';

describe('world-generator system-generator.ts', () => {
  it('should generate stars and planets', () => {
    const system = new SystemGenerator({});
    expect(system instanceof SystemGenerator).toBeTruthy();

    for (const star of system.generateStars()) {
    }
    expect(system.stars.length).toBeTruthy();
    for (const planet of system.generatePlanets()) {
    }
    expect(system.orbits.length).toBeTruthy();
  });
});
