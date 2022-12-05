import STARS_NAMES from '../../resources/STARS_NAMES';
import GALAXIES_NAMES from '../../resources/GALAXIES_NAMES';
// import PLANETS_NAMES from '../../resources/PLANETS_NAMES'

import RandomObject from './RandomObject';
import { MarkovModelBuilder, MarkovModel } from './MarkovNames';

export class Names {
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

  static _system_markov: MarkovModel;
  static get systemNamingStrategies() {
    return [
      [1, Names.PlainMarkovT(this._system_markov, [...STARS_NAMES, ...Names.names])],
      [0.1, Names.Named([...GALAXIES_NAMES, ...Names.names])],
    ];
  }
  static GenerateSystemName(random: RandomObject, count = 1) {
    return random.weighted(Names.systemNamingStrategies)(random);
  }

  static _galaxy_markov: MarkovModel;
  static get galaxyNamingStrategies() {
    return [
      [1, Names.PlainMarkovT(this._galaxy_markov, [...STARS_NAMES, ...Names.names])],
      [0.1, Names.Named(GALAXIES_NAMES)],
    ];
  }
  static PlainMarkovT(destination: MarkovModel, names: string[]) {
    return (random: RandomObject) => {
      if (!destination) {
        const m = new MarkovModelBuilder(2);
        m.TeachArray(names);
        destination = m.toModel();
      }
      return destination.Generate(random);
    };
  }
  static Named(names: string[]) {
    return (random: RandomObject) => {
      return random.choice(names).toLowerCase(); //+ "'s Star"
    };
  }
  static GenerateGalaxyName(random: RandomObject, count = 1) {
    return random.weighted(Names.galaxyNamingStrategies)(random);
  }

  static _markov: MarkovModel;
  static get namingStrategies() {
    return [
      [1, Names.PlainMarkovT(this._markov, Names.names)],
      [0.1, Names.Named(Names.names)],
    ];
  }

  // static PlainMarkov(random) {
  //   if (!Names._markov) {
  //     const m = new MarkovModelBuilder(2)
  //     m.TeachArray(Names.names)
  //     Names._markov = m.toModel()
  //   }
  //   return Names._markov.Generate(random)
  // }
  // static NamedStar(random) {
  //   return random.choice(Names.names).toLowerCase() //+ "'s Star"
  // }

  static Generate(random: RandomObject, count = 1) {
    return random.weighted(Names.namingStrategies)(random);

    // var choices = []
    // while (choices.length < count) {
    //   var newChoice = Names.Generate(random)
    //   // if (choices.Add(newChoice))
    //   choices.push(newChoice)
    //   yield newChoice
    // }
  }
}

export default Names;
