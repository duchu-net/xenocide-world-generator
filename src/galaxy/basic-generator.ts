import { RandomObject } from '../utils';

export interface BasicGeneratorOptions {
  seed?: number;
  random?: RandomObject;
}

export abstract class BasicGenerator<Options extends BasicGeneratorOptions> {
  protected readonly random: RandomObject;
  // public readonly options: Options;

  constructor(public readonly options: Options) {
    if (!options.seed) this.options.seed = Date.now();
    this.random = options.random || new RandomObject(this.options.seed);
    // if (!options.random) this.random = new RandomObject(this.options.seed);
  }

  toModel() { // todo
    return { ...this };
  }
}
