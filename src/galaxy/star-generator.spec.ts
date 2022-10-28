import { StarGenerator } from './star-generator';

describe('world-generator star-generator.ts', () => {
  it('should generate star Sun like physic', () => {
    const star = new StarGenerator({ mass: 1 });
    expect(star instanceof StarGenerator).toBeTruthy();

    expect(star.physic).toBeTruthy();
  });
});
