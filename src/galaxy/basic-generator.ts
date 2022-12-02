import { RandomObject } from '../utils';

/**
 * Basic class to handle model logic
 */
export class ModelHandler<ObjectModel> {
  schemaName: string = 'noname-model';
  constructor(public readonly model: ObjectModel) {}

  updateModel(fieldName: keyof ObjectModel, value: ObjectModel[typeof fieldName]) {
    // todo check that type
    this.model[fieldName] = value;
  }
  toModel(model: Partial<ObjectModel> = {}): ObjectModel {
    return { schema: this.schemaName, ...this.model, ...model };
  }
  toJSON() {
    return this.toModel();
  }
}

/**
 * Pure generator class with options
 */
export class PureGenerator<ObjectModel, Options> extends ModelHandler<ObjectModel> {
  override schemaName: string = 'noname-pure-generator';
  constructor(model: ObjectModel, public readonly options: Options) {
    super(model);
  }

  override toModel(model: Partial<ObjectModel> = {}): ObjectModel {
    return super.toModel({ options: this.options, ...model });
  }
}

/**
 * Pure generator extended with random
 */
export interface ModelGeneratorOptions {
  seed?: number;
  random?: RandomObject;
}
export class RandomGenerator<ObjectModel, Options extends ModelGeneratorOptions> extends PureGenerator<
  ObjectModel,
  Options
> {
  override schemaName: string = 'unnamed-basic-model-generator';
  protected readonly random: RandomObject;
  constructor(model: ObjectModel, options: Options) {
    super(model, options);

    if (!options.seed) this.options.seed = Date.now(); // todo we get same seeds for many items created asynchronously
    this.random = options.random || new RandomObject(this.options.seed);
  }

  override toModel(model: Partial<ObjectModel> = {}): ObjectModel {
    const { random, ...options } = this.options; // exclude RandomObject
    return super.toModel({ options, ...model });
  }
}
