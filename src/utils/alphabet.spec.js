import * as alphabet from './alphabet'
import assert from 'assert'

describe('Alphabet utils', () => {
  it('should export greekLetterNameToLetter Function', () => {
    assert.equal(typeof alphabet.greekLetterNameToLetter, 'function')
  })

  // it('should return "λ"', () => {
  //   assert.equal('λ', alphabet.greekLetterNameToLetter('lambda'));
  // });
  it('should return "ω" - greek omega letter', () => {
    assert.equal('ω', alphabet.greekLetterNameToLetter('omega'));
  });

  it('should export toRoman Function', () => {
    assert.equal(typeof alphabet.toRoman, 'function')
  })
  it('should return "IV" - roman 4 number', () => {
    assert.equal('IV', alphabet.toRoman(4));
  });
})
