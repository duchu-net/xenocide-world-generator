var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getStarsNames } from '../resources/STARS_NAMES';
import { capitalize } from './alphabet';
import { MarkovModelBuilder } from './MarkovNames';
export class StarName {
    constructor() { }
    static getInstance() {
        if (StarName.instance)
            return StarName.instance;
        // console.log(STARS_NAMES);
        StarName.instance = new MarkovModelBuilder(3).TeachArray(getStarsNames()).toModel();
        return StarName.instance;
    }
    static Greek(random) {
        // console.log('Greek');
        return random.choice(StarName.greekLetters);
    }
    static Decorator(random) {
        // console.log('Decorator');
        return random.choice(StarName.decorators);
    }
    static RomanNumeral(random) {
        // console.log('RomanNumeral');
        const integer = random.NormallyDistributedSingle4(10, 15, 1, 200);
        const bigInteger = random.NormallyDistributedSingle4(400, 100, 200, 3000);
        return StarName.ToRoman(random.unit() > 0.8 ? integer : bigInteger);
    }
    static Integer(random) {
        // console.log('Integer');
        const number = random.NormallyDistributedSingle4(100, 5, 1, 1000);
        return Math.trunc(Math.abs(number));
    }
    static Decimal(random) {
        // console.log('Decimal');
        const number = random.NormallyDistributedSingle4(100, 5, 1, 1000);
        return Math.abs(parseInt(number.toFixed(2)));
    }
    static Letter(random) {
        // console.log('Letter');
        return String.fromCharCode(random.integer(65, 90));
    }
    // static markovNameModel = new MarkovModelBuilder(3).TeachArray(STARS_NAMES).toModel();
    static PlainMarkov(random) {
        // console.log('PlainMarkov');
        const str = StarName.getInstance().Generate(random); // todo capitalize?
        return capitalize(str);
    }
    static NamedStar(random) {
        // console.log('NamedStar');
        return random.choice(getStarsNames());
    }
    static WithDecoration(probability, func) {
        return (random) => {
            // console.log('WithDecoration');
            const result = func(random);
            if (random.unit() > probability)
                return result;
            const prefix = random.weighted(StarName._prefixStrategies)(random) + ' ';
            const suffix = ' ' + random.weighted(StarName._suffixStrategies)(random);
            switch (random.weighted([
                [0.4, 'neither'],
                [1.0, 'prefix'],
                [1.0, 'suffix'],
                [0.2, 'both'],
            ])) {
                case 'prefix':
                    return prefix + result;
                case 'suffix':
                    return result + suffix;
                case 'both':
                    return prefix + result + suffix;
                default:
                    return result;
            }
        };
    }
    static ToRoman(number) {
        if (number < 1)
            return '';
        if (number >= 1000)
            return 'M' + StarName.ToRoman(number - 1000);
        if (number >= 900)
            return 'CM' + StarName.ToRoman(number - 900);
        if (number >= 500)
            return 'D' + StarName.ToRoman(number - 500);
        if (number >= 400)
            return 'CD' + StarName.ToRoman(number - 400);
        if (number >= 100)
            return 'C' + StarName.ToRoman(number - 100);
        if (number >= 90)
            return 'XC' + StarName.ToRoman(number - 90);
        if (number >= 50)
            return 'L' + StarName.ToRoman(number - 50);
        if (number >= 40)
            return 'XL' + StarName.ToRoman(number - 40);
        if (number >= 10)
            return 'X' + StarName.ToRoman(number - 10);
        if (number >= 9)
            return 'IX' + StarName.ToRoman(number - 9);
        if (number >= 5)
            return 'V' + StarName.ToRoman(number - 5);
        if (number >= 4)
            return 'IV' + StarName.ToRoman(number - 4);
        if (number >= 1)
            return 'I' + StarName.ToRoman(number - 1);
        throw new RangeError();
    }
    static Generate(random) {
        return random.weighted(StarName._namingStrategies)(random).trim();
    }
    static GenerateCount(random_1) {
        return __awaiter(this, arguments, void 0, function* (random, count = 1) {
            const names = [];
            while (names.length < count) {
                const name = yield StarName.Generate(random);
                if (names.indexOf(name) === -1)
                    names.push(name);
            }
            // console.log('>>', names, '<<');
            return names;
        });
    }
}
StarName._prefixStrategies = [
    // [1.0, StarName.Greek],
    [1.0, StarName.Decorator],
    [0.01, StarName.RomanNumeral],
    [1.0, StarName.Letter],
    [1.0, StarName.Integer],
    [0.3, StarName.Decimal],
    [0.0, () => 'Al'],
    [0.0, () => 'San'],
];
StarName._suffixStrategies = [
    // [1.0, StarName.Greek],
    [1.0, StarName.Decorator],
    [1.0, StarName.RomanNumeral],
    [1.0, StarName.Letter],
    [1.0, StarName.Integer],
    [0.3, StarName.Decimal],
];
StarName._namingStrategies = [
    [1, StarName.PlainMarkov],
    [1, StarName.WithDecoration(1, StarName.WithDecoration(0.001, StarName.PlainMarkov))],
    [0.05, (random) => StarName.Letter(random) + '-' + StarName.Integer(random)],
    [0.01, StarName.NamedStar],
    [0.01, (random) => random.choice(StarName.specialLocations)],
];
StarName.specialLocations = [
    'Epsilon Eridani',
    'San Martin',
    'Seaford Nine',
    'Proctor Three',
    'Smoking Frog',
    'First of the Sun',
    'Xendi Sabu',
    'Bela Tegeuse',
];
StarName.greekLetters = [
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
StarName.decorators = ['Major', 'Majoris', 'Minor', 'Minoris', 'Prime', 'Secundis'];
export default StarName;
