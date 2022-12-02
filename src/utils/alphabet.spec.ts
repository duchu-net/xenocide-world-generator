import { decimalToRoman, greekLetterNameToLetter, romanToDecimal } from './alphabet';

const values = [
  [1, 'I'],
  [2, 'II'],
  [3, 'III'],
  [4, 'IV'],
  [5, 'V'],
  [6, 'VI'],
  [7, 'VII'],
  [8, 'VIII'],
  [9, 'IX'],
  [10, 'X'],
  [11, 'XI'],
  [40, 'XL'],
  [41, 'XLI'],
  [50, 'L'],
  [51, 'LI'],
  [99, 'XCIX'],
  [100, 'C'],
  [499, 'CDXCIX'],
  [500, 'D'],
  [999, 'CMXCIX'],
  [1000, 'M'],
  [2023, 'MMXXIII'],
  [4587, 'MMMMDLXXXVII'],
  [4999, 'MMMMCMXCIX'],
] as const;

describe('word-generator util alphabet.ts', () => {
  it('decimalToRoman should work', () => {
    values.map(([decimal, roman]) => expect(decimalToRoman(decimal)).toEqual(roman));
  });

  it('romanToDecimal should work', () => {
    values.map(([decimal, roman]) => expect(romanToDecimal(roman)).toEqual(decimal));
  });

  it('greekLetterNameToLetter should return "ω" - greek omega letter', () => {
    expect(greekLetterNameToLetter('omega')).toEqual('ω');
  });
});
