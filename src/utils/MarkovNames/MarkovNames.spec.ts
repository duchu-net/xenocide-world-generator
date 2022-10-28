import { MarkovModelBuilder } from './MarkovModelBuilder';
import STARS_NAMES, { REAL_STARS_NAMES } from '../../../resources/STARS_NAMES';
import { RandomObject } from '../RandomObject';

describe('MarkovNames names utils', () => {
  it("should generate 'abcdefghijk'", () => {
    const modelBuilder = new MarkovModelBuilder(2).Teach('abcdefghijk').toModel();
    expect(modelBuilder.Generate(new RandomObject(1234567890))).toEqual('abcdefghijk');
  });

  // todo fix it?
  it.skip('should generate 100 uniq stars names', (done) => {
    const modelBuilder = new MarkovModelBuilder(4);
    // console.log(REAL_STARS_NAMES);
    modelBuilder.TeachArray(STARS_NAMES);
    const model = modelBuilder.toModel();
    const random = new RandomObject('abc');

    let count = 100;
    const generated: string[] = [];
    while (count > 0) {
      const n = model.Generate(random); //.Trim();
      // console.log('name', n);
      if (!STARS_NAMES.find((s) => s.toLowerCase() == n) && !generated.find((s) => s == n)) {
        generated.push(n);
        // console.log('Uniq name:', generated.length, n)
        count--;
      }
    }

    // assert.equal(100, generated.length);
    expect(generated.length).toEqual(100);
  }, 10000);
});
