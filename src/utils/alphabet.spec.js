import * as alphabet from './alphabet'
import assert from 'assert'

describe('Alphabet utils', () => {
  it('should export a Function', () => {
    assert.equal(typeof alphabet.greekLetterNameToLetter, 'function')
  })

  // it('should return "λ"', () => {
  //   assert.equal('λ', alphabet.greekLetterNameToLetter('lambda'));
  // });
  it('should return "ω"', () => {
    assert.equal('ω', alphabet.greekLetterNameToLetter('omega'));
  });
})
