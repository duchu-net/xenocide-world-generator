import { StarGenerator } from './star-generator';

describe('world-generator star-generator.ts', () => {
  it('should generate star Sun like physic', () => {
    const star = new StarGenerator({ mass: 1 });
    expect(star instanceof StarGenerator).toBeTruthy();

    expect(star.physic?.stellar_class).toEqual('G');
    expect(star.physic?.temperature).toEqual(1);
    expect(star.physic?.luminosity).toEqual(1);
    expect(star.physic?.evolution).toEqual(true);
    expect(star.physic?.radius).toEqual(1);
  });

  it('should generate same star for same seeds', () => {
    const star1 = new StarGenerator({}, { seed: 1234567890 });
    const star2 = new StarGenerator({}, { seed: 1234567890 });

    expect(star1.physic).not.toBeNull();
    expect(star2.physic).not.toBeNull();
    expect(star1).toEqual(star2);
    expect(star1.toModel()).toEqual(star2.toModel());
  });
});
