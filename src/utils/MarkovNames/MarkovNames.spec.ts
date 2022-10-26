// import * as alphabet from './alphabet'
import assert from 'assert'
import Random from '../RandomObject'
import ModelBuilder from './MarkovModelBuilder'
import STARS_NAMES, { REAL_STARS_NAMES } from '../../../resources/STARS_NAMES'


describe('MarkovNames names utils', () => {
  // it('should export greekLetterNameToLetter Function', () => {
  //   assert.equal(typeof alphabet.greekLetterNameToLetter, 'function')
  // })

  it('should teach one', () => {
    const m = new ModelBuilder(2);
    m.Teach("a");
    assert.ok(true)
  });

  it('should generate \'abcdefghijk\'', () => {
    const mod = new ModelBuilder(2)
      .Teach("abcdefghijk")
      .toModel();
    assert.equal('abcdefghijk', mod.Generate(new Random(1234567890)))
  });

  it('should generate 100 uniq stars names', (done) => {
    const m = new ModelBuilder(4);
    // console.log(REAL_STARS_NAMES);
    m.TeachArray(STARS_NAMES);
    var mod = m.toModel();
    const r = new Random('abc')

    let count = 100;
    const generated = []
    while (count > 0) {
      var n = mod.Generate(r)//.Trim();
      // console.log('name', n);
      if (!STARS_NAMES.find(s => s.toLowerCase() == n) && !generated.find(s => s == n)) {
        generated.push(n)
        // console.log('Uniq name:', generated.length, n)
        count--
      }
    }

    assert.equal(100, generated.length)
    done()
  }).timeout(2000)
})
