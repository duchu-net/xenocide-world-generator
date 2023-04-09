// @formatter:off
export const ISO_LATIN = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
export const GREEK_LETTERS_NAMES = ['alpha','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa','lambda','mu','nu','xi','omicron','pi','rho','sigma','tau','upsilon','phi','chi','psi','omega']
export const GREEK_LETTERS = ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω']
// @formatter:on

export function greekLetterNameToLetter(name: string) {
  return GREEK_LETTERS[GREEK_LETTERS_NAMES.indexOf(name)]
}

export const numberToGreekChar = (num: number) => {
  return GREEK_LETTERS[num % GREEK_LETTERS.length];
};

function romanCharToInt(char: string) {
  switch (char) {
    case 'I':
      return 1;
    case 'V':
      return 5;
    case 'X':
      return 10;
    case 'L':
      return 50;
    case 'C':
      return 100;
    case 'D':
      return 500;
    case 'M':
      return 1000;
    default:
      return -1;
  }
}

export const romanToDecimal = (str?: string): number => {
  if (str == null) return -1;
  let num = romanCharToInt(str.charAt(0));
  let prev: number;
  let curr: number;

  for (let i = 1; i < str.length; i++) {
    curr = romanCharToInt(str.charAt(i));
    prev = romanCharToInt(str.charAt(i - 1));
    num = curr <= prev ? num + curr : num - prev * 2 + curr;
  }

  return num;
};

// max is 4999, for >=5000 should use extended roman numeral (V̅, V̅I̅, V̅I̅I̅, V̅I̅I̅I, I̅X̅, X̅)
export const decimalToRoman = (num: number): string => {
  // if (num < 1 || num > 4999) return '';
  if (num < 1) return '';
  if (num >= 1000) return `M${decimalToRoman(num - 1000)}`;
  if (num >= 900) return `CM${decimalToRoman(num - 900)}`;
  if (num >= 500) return `D${decimalToRoman(num - 500)}`;
  if (num >= 400) return `CD${decimalToRoman(num - 400)}`;
  if (num >= 100) return `C${decimalToRoman(num - 100)}`;
  if (num >= 90) return `XC${decimalToRoman(num - 90)}`;
  if (num >= 50) return `L${decimalToRoman(num - 50)}`;
  if (num >= 40) return `XL${decimalToRoman(num - 40)}`;
  if (num >= 10) return `X${decimalToRoman(num - 10)}`;
  if (num >= 9) return `IX${decimalToRoman(num - 9)}`;
  if (num >= 5) return `V${decimalToRoman(num - 5)}`;
  if (num >= 4) return `IV${decimalToRoman(num - 4)}`;
  if (num >= 1) return `I${decimalToRoman(num - 1)}`;
  throw new RangeError();
};

export const codename = (str?: string) => {
  return str?.toLowerCase().replace(' ', '_');
};

export const capitalize = (str: string) => {
  return  str && str[0].toLocaleUpperCase() + str.substring(1)
}