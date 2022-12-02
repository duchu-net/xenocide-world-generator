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

  toModel() {
    // todo
    return { ...this };
  }
}

export abstract class BasicModelGenerator<Model, Options> {
  schemaName: string = 'unnamed-basic-model-generator';
  constructor(public readonly model: Model, public readonly options: Options) {}

  toModel(model: Partial<Model> = {}): Model {
    return { schema: this.schemaName, ...this.model, ...model };
  }
  toJSON() {
    return this.toModel();
  }
}

// export interface ExtendedGeneratorModel {
//   seed?: number;
//   random?: RandomObject;
// }
export abstract class ExtendedGenerator<Model, Options extends BasicGeneratorOptions> {
  schemaName: string = 'unnamed-extended-generator';
  protected readonly random: RandomObject;

  constructor(public readonly model: Model, public readonly options: Options) {
    if (!options.seed) this.options.seed = Date.now();
    this.random = options.random || new RandomObject(this.options.seed);
    // if (!options.random) this.random = new RandomObject(this.options.seed);
  }

  toModel(model: Partial<Model> = {}): Model {
    return { schema: this.schemaName, ...this.model, ...model };
  }
  toJSON() {
    return this.toModel();
  }
}
