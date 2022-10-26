// @formatter:off
export const ISO_LATIN = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
export const GREEK_LETTERS_NAMES = ['alpha','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa','lambda','mu','nu','xi','omicron','pi','rho','sigma','tau','upsilon','phi','chi','psi','omega']
export const GREEK_LETTERS = ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω']
// @formatter:on

export function greekLetterNameToLetter(name: string) {
  return GREEK_LETTERS[GREEK_LETTERS_NAMES.indexOf(name)]
}

export function toRoman(number: number): string {
  if (number < 1) return ''
  if (number >= 1000) return "M" + toRoman(number - 1000)
  if (number >= 900) return "CM" + toRoman(number - 900)
  if (number >= 500) return "D" + toRoman(number - 500)
  if (number >= 400) return "CD" + toRoman(number - 400)
  if (number >= 100) return "C" + toRoman(number - 100)
  if (number >= 90) return "XC" + toRoman(number - 90)
  if (number >= 50) return "L" + toRoman(number - 50)
  if (number >= 40) return "XL" + toRoman(number - 40)
  if (number >= 10) return "X" + toRoman(number - 10)
  if (number >= 9) return "IX" + toRoman(number - 9)
  if (number >= 5) return "V" + toRoman(number - 5)
  if (number >= 4) return "IV" + toRoman(number - 4)
  if (number >= 1) return "I" + toRoman(number - 1)
  throw new RangeError()
}
