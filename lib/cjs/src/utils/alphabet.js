"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.codename = exports.decimalToRoman = exports.romanToDecimal = exports.numberToGreekChar = exports.GREEK_LETTERS = exports.GREEK_LETTERS_NAMES = exports.ISO_LATIN = void 0;
exports.greekLetterNameToLetter = greekLetterNameToLetter;
// @formatter:off
exports.ISO_LATIN = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
exports.GREEK_LETTERS_NAMES = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];
exports.GREEK_LETTERS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
// @formatter:on
function greekLetterNameToLetter(name) {
    return exports.GREEK_LETTERS[exports.GREEK_LETTERS_NAMES.indexOf(name)];
}
const numberToGreekChar = (num) => {
    return exports.GREEK_LETTERS[num % exports.GREEK_LETTERS.length];
};
exports.numberToGreekChar = numberToGreekChar;
function romanCharToInt(char) {
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
const romanToDecimal = (str) => {
    if (str == null)
        return -1;
    let num = romanCharToInt(str.charAt(0));
    let prev;
    let curr;
    for (let i = 1; i < str.length; i++) {
        curr = romanCharToInt(str.charAt(i));
        prev = romanCharToInt(str.charAt(i - 1));
        num = curr <= prev ? num + curr : num - prev * 2 + curr;
    }
    return num;
};
exports.romanToDecimal = romanToDecimal;
// max is 4999, for >=5000 should use extended roman numeral (V̅, V̅I̅, V̅I̅I̅, V̅I̅I̅I, I̅X̅, X̅)
const decimalToRoman = (num) => {
    // if (num < 1 || num > 4999) return '';
    if (num < 1)
        return '';
    if (num >= 1000)
        return `M${(0, exports.decimalToRoman)(num - 1000)}`;
    if (num >= 900)
        return `CM${(0, exports.decimalToRoman)(num - 900)}`;
    if (num >= 500)
        return `D${(0, exports.decimalToRoman)(num - 500)}`;
    if (num >= 400)
        return `CD${(0, exports.decimalToRoman)(num - 400)}`;
    if (num >= 100)
        return `C${(0, exports.decimalToRoman)(num - 100)}`;
    if (num >= 90)
        return `XC${(0, exports.decimalToRoman)(num - 90)}`;
    if (num >= 50)
        return `L${(0, exports.decimalToRoman)(num - 50)}`;
    if (num >= 40)
        return `XL${(0, exports.decimalToRoman)(num - 40)}`;
    if (num >= 10)
        return `X${(0, exports.decimalToRoman)(num - 10)}`;
    if (num >= 9)
        return `IX${(0, exports.decimalToRoman)(num - 9)}`;
    if (num >= 5)
        return `V${(0, exports.decimalToRoman)(num - 5)}`;
    if (num >= 4)
        return `IV${(0, exports.decimalToRoman)(num - 4)}`;
    if (num >= 1)
        return `I${(0, exports.decimalToRoman)(num - 1)}`;
    throw new RangeError();
};
exports.decimalToRoman = decimalToRoman;
const codename = (str) => {
    return str === null || str === void 0 ? void 0 : str.toLowerCase().replace(/\s/g, '_').replace(/'/g, '').replace(/`/g, '');
};
exports.codename = codename;
const capitalize = (str) => {
    return str && str[0].toLocaleUpperCase() + str.substring(1);
};
exports.capitalize = capitalize;
//# sourceMappingURL=alphabet.js.map