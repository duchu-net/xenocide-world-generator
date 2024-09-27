import { Grid } from '../galaxy-shape';
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

    //
    const galaxy2 = new GalaxyGenerator({}).shape(new Grid({ size: 5, spacing: 2 }));
    expect([...galaxy2.generateSystems()]).toHaveLength(27);
    // expect(galaxy2.model.classification).toBe('grid');
    expect(galaxy2.model.classification).toBe('Grid');

    //
    const galaxy3 = new GalaxyGenerator({ classification: 'spiral' }).shape(
      new Grid({ size: 5, spacing: 2 })
    );
    expect([...galaxy3.generateSystems()]).toHaveLength(27);
    expect(galaxy3.model.classification).toBe('Grid');
  });
});
