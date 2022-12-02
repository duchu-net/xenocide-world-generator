import { PlanetGenerator } from './planet-generator';

describe('world-generator planet-generator.ts', () => {
  it('should generate regions', () => {
    const planet = new PlanetGenerator({});
    expect(planet instanceof PlanetGenerator).toBeTruthy();

    for (const region of planet.generateSurface()) {
    }
    expect(planet.regions.length).toBeTruthy();
  });
});
