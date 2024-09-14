"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Names = void 0;
const GALAXIES_NAMES_1 = require("../resources/GALAXIES_NAMES");
const STARS_NAMES_1 = require("../resources/STARS_NAMES");
const MarkovNames_1 = require("./MarkovNames");
class Names {
    constructor() { }
    static PlainMarkovT(destination, names) {
        return (random) => {
            if (!destination) {
                const model = new MarkovNames_1.MarkovModelBuilder(2);
                model.TeachArray(names);
                destination = model.toModel();
            }
            // console.log(destination, names);
            return destination.Generate(random);
        };
    }
    static Named(names) {
        return (random) => {
            return random.choice(names).toLowerCase(); //+ "'s Star"
        };
    }
    static get systemNamingStrategies() {
        return [
            [1, this.PlainMarkovT(this._system_markov, [...(0, STARS_NAMES_1.getStarsNames)(), ...this.names])],
            [0.1, this.Named([...(0, GALAXIES_NAMES_1.getGalaxiesNames)(), ...this.names])],
        ];
    }
    static GenerateSystemName(random, count = 1) {
        return random.weighted(this.systemNamingStrategies)(random);
    }
    static getGalaxyNamingStrategies() {
        return [
            [1, this.PlainMarkovT(this._galaxy_markov, [...(0, STARS_NAMES_1.getStarsNames)(), ...this.names])],
            [0.1, this.Named((0, GALAXIES_NAMES_1.getGalaxiesNames)())],
        ];
    }
    static GenerateGalaxyName(random, count = 1) {
        return random.weighted(this.getGalaxyNamingStrategies())(random);
    }
    static get namingStrategies() {
        return [
            [1, this.PlainMarkovT(this._markov, this.names)],
            [0.1, this.Named(this.names)],
        ];
    }
    // static PlainMarkov(random) {
    //   if (!this._markov) {
    //     const m = new MarkovModelBuilder(2)
    //     m.TeachArray(this.names)
    //     this._markov = m.toModel()
    //   }
    //   return this._markov.Generate(random)
    // }
    // static NamedStar(random) {
    //   return random.choice(this.names).toLowerCase() //+ "'s Star"
    // }
    static Generate(random, count = 1) {
        return random.weighted(this.namingStrategies)(random);
        // var choices = []
        // while (choices.length < count) {
        //   var newChoice = this.Generate(random)
        //   // if (choices.Add(newChoice))
        //   choices.push(newChoice)
        //   yield newChoice
        // }
    }
}
exports.Names = Names;
Names.names = [
    'Trevor',
    'Yeltsin',
    'Barnard',
    'Genovese',
    'Martin',
    'Simon',
    'Rob',
    'Ed',
    'Walter',
    'Mohammed',
    'Emil',
    'Shannon',
    'Nicole',
    'Yury',
    'Coleman',
    'Deanne',
    'Rosenda',
    'Geoffrey',
    'Taryn',
    'Noreen',
    'Rita',
    'Jeanetta',
    'Stanton',
    'Alesha',
    'Mark',
    'Georgiann',
    'Modesta',
    'Lee',
    'Cyndi',
    'Raylene',
    'Ellamae',
    'Sharmaine',
    'Candra',
    'Karine',
    'Trena',
    'Tarah',
    'Dorie',
    'Kyoko',
    'Wei',
    'Cristopher',
    'Yoshie',
    'Meany',
    'Zola',
    'Corene',
    'Suzie',
    'Sherwood',
    'Monnie',
    'Savannah',
    'Amalia',
    'Lon',
    'Luetta',
    'Concetta',
    'Dani',
    'Sharen',
    'Mora',
    'Wilton',
    'Hunter',
    'Nobuko',
    'Maryellen',
    'Johnetta',
    'Eleanora',
    'Arline',
    'Rae',
    'Caprice',
];
Names.specialLocations = [
    'Epsilon Eridani',
    'San Martin',
    'Seaford Nine',
    'Proctor Three',
    'Smoking Frog',
    'First of the Sun',
    'Xendi Sabu',
    'Bela Tegeuse',
];
Names.greekLetters = [
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
Names.decorators = ['Major', 'Majoris', 'Minor', 'Minoris', 'Prime', 'Secundis', 'System'];
exports.default = this;
