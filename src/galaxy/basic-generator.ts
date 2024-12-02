import { RandomObject } from '../utils';

/**
 * Basic class to handle model logic
 */
export class ModelHandler<ObjectModel> {
  readonly schemaName: string = 'noname-model';
  constructor(public readonly model: ObjectModel) {}

  /**
   * update stored model with value
   * @param fieldName key name in model
   * @param value value to insert into Model[fieldName]
   * @return inserted value
   */
  updateModel<T extends keyof ObjectModel>(fieldName: T, value: ObjectModel[T]) {
    this.model[fieldName] = value;
    return this.model[fieldName];
  }

  toModel(model: Partial<ObjectModel> = {}): ObjectModel {
    return { schemaName: this.schemaName, ...this.model, ...model };
  }

  /**
   * @returns plain Model for JSON conversion
   */
  toJSON(): ObjectModel {
    return this.toModel();
  }
}

/**
 * Pure generator class with options
 */
export class PureGenerator<ObjectModel, Options> extends ModelHandler<ObjectModel> {
  override readonly schemaName: string = 'noname-pure-generator';
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
export interface RandomGeneratorOptions {
  seed?: number;
  random?: RandomObject;
}
export class RandomGenerator<ObjectModel, Options extends RandomGeneratorOptions> extends PureGenerator<
  ObjectModel,
  Options
> {
  override readonly schemaName: string = 'unnamed-basic-model-generator';
  protected random: RandomObject;
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
