import { getPathTarget, parseWorldPath } from './world-path';

/**
 * nx run world-generator:test --testFile=libs/world-generator/src/utils/world-path.spec.ts
 */
describe('WorldPath - world-path.ts', () => {
  test('Should resolve world path target', () => {
    expect(getPathTarget('')).toBeFalsy();
    expect(getPathTarget('galaxy1')).toBe('galaxy');
    expect(getPathTarget('galaxy1/system1')).toBe('system');
    expect(getPathTarget('galaxy1/system1/s:star1')).toBe('star');
    expect(getPathTarget('galaxy1/system1/b:belt1')).toBe('belt');
    expect(getPathTarget('galaxy1/system1/p:planet1/m:moon1')).toBe('moon');
    expect(getPathTarget('galaxy1/system1/p:planet1/r:region1/c:construction1')).toBe('construction');
  });

  test('Path not contains designation', () => {
    const result = parseWorldPath('');
    expect(result.galaxy).toBeFalsy();
    expect(result.system).toBeFalsy();
    expect(result.planet).toBeFalsy();
    expect(result.target).toBeFalsy();
  });

  test('Path contains galaxy, system and star', () => {
    const result = parseWorldPath('galaxy1/system1/s:star1');
    expect(result).toMatchObject({
      galaxy: 'galaxy1',
      system: 'system1',
      star: 'star1',
      target: 'star',
    });
  });

  test('Path contains galaxy, system and belt', () => {
    const result = parseWorldPath('galaxy1/system1/b:belt1');
    expect(result).toMatchObject({
      galaxy: 'galaxy1',
      system: 'system1',
      belt: 'belt1',
      target: 'belt',
    });
    expect(result.belt).toBeTruthy();
    expect(result.planet).toBeFalsy();
  });

  test('Path contains galaxy, system, planet, region and construction', () => {
    const result = parseWorldPath('galaxy1/system1/p:planet1/r:region1/c:construction1');
    expect(result).toMatchObject({
      galaxy: 'galaxy1',
      system: 'system1',
      planet: 'planet1',
      region: 'region1',
      construction: 'construction1',
      target: 'construction',
    });
  });

  test('Path contains galaxy, system, planet and moon', () => {
    const result = parseWorldPath('galaxy1/system1/p:planet1/m:moon1');
    expect(result).toMatchObject({
      galaxy: 'galaxy1',
      system: 'system1',
      planet: 'planet1',
      moon: 'moon1',
      target: 'moon',
    });
  });
});
