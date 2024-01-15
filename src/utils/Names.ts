import { getStarsNames } from '../../resources/STARS_NAMES';
import { getGalaxiesNames } from '../../resources/GALAXIES_NAMES';
// import PLANETS_NAMES from '../../resources/PLANETS_NAMES'

import RandomObject from './RandomObject';
import { MarkovModelBuilder, MarkovModel } from './MarkovNames';

export class Names {
  private constructor() {}

  static names = [
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
  static decorators = ['Major', 'Majoris', 'Minor', 'Minoris', 'Prime', 'Secundis', 'System'];

  static PlainMarkovT(destination: MarkovModel, names: string[]) {
    return (random: RandomObject) => {
      if (!destination) {
        const model = new MarkovModelBuilder(2);
        model.TeachArray(names);
        destination = model.toModel();
      }
      // console.log(destination, names);
      return destination.Generate(random);
    };
  }
  static Named(names: string[]) {
    return (random: RandomObject) => {
      return random.choice(names).toLowerCase(); //+ "'s Star"
    };
  }

  static _system_markov: MarkovModel;
  static get systemNamingStrategies() {
    return [
      [1, this.PlainMarkovT(this._system_markov, [...getStarsNames(), ...this.names])],
      [0.1, this.Named([...getGalaxiesNames(), ...this.names])],
    ];
  }
  static GenerateSystemName(random: RandomObject, count = 1) {
    return random.weighted(this.systemNamingStrategies)(random);
  }

  static _galaxy_markov: MarkovModel;
  static getGalaxyNamingStrategies() {
    return [
      [1, this.PlainMarkovT(this._galaxy_markov, [...getStarsNames(), ...this.names])],
      [0.1, this.Named(getGalaxiesNames())],
    ];
  }

  static GenerateGalaxyName(random: RandomObject, count = 1): string {
    return random.weighted(this.getGalaxyNamingStrategies())(random);
  }

  static _markov: MarkovModel;
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

  static Generate(random: RandomObject, count = 1) {
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

export default this;
