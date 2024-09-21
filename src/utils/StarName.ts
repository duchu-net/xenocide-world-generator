import { names, getAllStarNames } from '../resources/STARS_NAMES';

import { MarkovModel } from './MarkovNames/MarkovModel';
import { capitalize } from './alphabet';
import { MarkovModelBuilder } from './MarkovNames';
import { RandomObject } from './random';

type StringGenerator = (random: RandomObject) => string | number;

export class StarName {
  private constructor() {}
  static instance?: MarkovModel;
  static getInstance() {
    if (StarName.instance) return StarName.instance;
    // console.log(STARS_NAMES);
    StarName.instance = new MarkovModelBuilder(3).TeachArray(getAllStarNames()).toModel();
    return StarName.instance;
  }

  static specialLocations = [
    'Epsilon Eridani',
    'San Martin',
    'Seaford Nine',
    'Proctor Three',
    'Smoking Frog',
    'First of the Sun',
    'Xendi Sabu',
    'Bela Tegeuse',
  ];
  static greekLetters = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omnicron',
    'Pi',
    'Rho',
    'Sigma',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega',
  ];
  static decorators = ['Major', 'Majoris', 'Minor', 'Minoris', 'Prime', 'Secundis'];

  static Greek(random: RandomObject) {
    // console.log('Greek');
    return random.choice(StarName.greekLetters);
  }
  static Decorator(random: RandomObject) {
    // console.log('Decorator');
    return random.choice(StarName.decorators);
  }
  static RomanNumeral(random: RandomObject) {
    // console.log('RomanNumeral');
    const integer = random.NormallyDistributedSingle4(10, 15, 1, 200);
    const bigInteger = random.NormallyDistributedSingle4(400, 100, 200, 3000);
    return StarName.ToRoman(random.unit() > 0.8 ? integer : bigInteger);
  }
  static Integer(random: RandomObject) {
    const number = random.NormallyDistributedSingle4(100, 5, 1, 1000);
    return Math.trunc(Math.abs(number));
  }

  /**
   * Generates a decimal number between 1 and 1000 with 2 decimal places
   * @returns e.g. `123.45`
   */
  static Decimal(random: RandomObject) {
    const number = random.NormallyDistributedSingle4(100, 5, 1, 1000);
    return Math.abs(parseInt(number.toFixed(2)));
  }
  /**
   * Generates a random letter between A and Z
   * @returns e.g. `A`
   */
  static Letter(random: RandomObject) {
    return String.fromCharCode(random.integer(65, 90));
  }

  /**
   * Generates a random star name based on a pattern
   * @param pattern default: `AAA-000`
   * @returns e.g. `XYZ-123`
   */
  static Pattern(random: RandomObject, pattern = 'AAA-000') {
    const Digit = () => random.integer(0, 9);
    const Letter = () => String.fromCharCode(random.integer(65, 90));
    return pattern.replace(/A/g, () => Letter()).replace(/0/g, () => `${Digit()}`);
  }

  // static markovNameModel = new MarkovModelBuilder(3).TeachArray(STARS_NAMES).toModel();
  static PlainMarkov(random: RandomObject) {
    const str = StarName.getInstance().Generate(random); // todo capitalize?
    return capitalize(str);
  }
  static NamedStar(random: RandomObject) {
    return random.choice(getAllStarNames());
  }

  static WithPrefixStrategy(func: StringGenerator, strategies = defaultPrefixStrategies) {
    return (random: RandomObject) => {
      const prefix = random.weighted(strategies)(random);
      return `${prefix} ${func(random)}`;
    };
  }

  static WithSuffixStrategy(func: StringGenerator, strategies = defaultSuffixStrategies) {
    return (random: RandomObject) => {
      const suffix = random.weighted(strategies)(random);
      return `${func(random)} ${suffix}`;
    };
  }

  static ToRoman(number: number): string {
    if (number < 1) return '';
    if (number >= 1000) return 'M' + StarName.ToRoman(number - 1000);
    if (number >= 900) return 'CM' + StarName.ToRoman(number - 900);
    if (number >= 500) return 'D' + StarName.ToRoman(number - 500);
    if (number >= 400) return 'CD' + StarName.ToRoman(number - 400);
    if (number >= 100) return 'C' + StarName.ToRoman(number - 100);
    if (number >= 90) return 'XC' + StarName.ToRoman(number - 90);
    if (number >= 50) return 'L' + StarName.ToRoman(number - 50);
    if (number >= 40) return 'XL' + StarName.ToRoman(number - 40);
    if (number >= 10) return 'X' + StarName.ToRoman(number - 10);
    if (number >= 9) return 'IX' + StarName.ToRoman(number - 9);
    if (number >= 5) return 'V' + StarName.ToRoman(number - 5);
    if (number >= 4) return 'IV' + StarName.ToRoman(number - 4);
    if (number >= 1) return 'I' + StarName.ToRoman(number - 1);
    throw new RangeError();
  }

  static GenerateGalaxyName(random: RandomObject): string {
    return random.weighted([
      [
        1,
        () =>
          new MarkovModelBuilder(2)
            .TeachArray([...getAllStarNames(), ...names.real.names])
            .toModel()
            .Generate(random),
      ],
      [0.1, () => StarName.Generate(random)],
    ])(random);
  }

  static Generate(random: RandomObject, strategies = defaultNamingStrategies) {
    return random.weighted(strategies)(random).trim();
  }
  static async GenerateCount(random: RandomObject, count = 1) {
    const names = [];
    while (names.length < count) {
      const name = await StarName.Generate(random);
      if (names.indexOf(name) === -1) names.push(name);
    }
    // console.log('>>', names, '<<');
    return names;
  }
}

type Propability = number;

const defaultPrefixStrategies: [Propability, StringGenerator][] = [
  [0.01, StarName.Greek],
  [0.2, StarName.Decorator],
  [0.01, StarName.RomanNumeral],
  [1.0, StarName.Letter],
  [1.0, StarName.Integer],
  [0.3, StarName.Decimal],
  [0.01, () => 'Al'],
  [0.01, () => 'San'],
];

const defaultSuffixStrategies: [Propability, StringGenerator][] = [
  // [1.0, StarName.Greek],
  [0.1, StarName.Decorator],
  [1.0, StarName.RomanNumeral],
  [1.0, StarName.Letter],
  [1.0, StarName.Integer],
  [0.3, StarName.Decimal],
];

const defaultNamingStrategies: [Propability, StringGenerator][] = [
  [1, StarName.PlainMarkov],
  [0.4, StarName.WithPrefixStrategy(StarName.PlainMarkov)],
  [0.4, StarName.WithSuffixStrategy(StarName.PlainMarkov)],
  [0.15, StarName.WithPrefixStrategy(StarName.WithSuffixStrategy(StarName.PlainMarkov))],
  [0.8, (random) => StarName.Pattern(random, 'AAA-000')],
  [0.2, (random) => StarName.Pattern(random, 'AAA-000-AA')],
  [0.01, (random) => StarName.Pattern(random, '00-AA')],
  [0.05, (random) => `${StarName.Letter(random)}-${StarName.Integer(random)}`],
  [0.01, StarName.NamedStar],
  [0.01, (random) => `${random.choice(StarName.specialLocations)} ${StarName.Pattern(random, 'A00')}`],
];
