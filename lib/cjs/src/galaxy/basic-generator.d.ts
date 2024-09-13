import { RandomObject } from '../utils';
/**
 * Basic class to handle model logic
 */
export declare class ModelHandler<ObjectModel> {
    readonly model: ObjectModel;
    readonly schemaName: string;
    constructor(model: ObjectModel);
    /**
     * update stored model with value
     * @param fieldName key name in model
     * @param value value to insert into Model[fieldName]
     * @return inserted value
     */
    updateModel<T extends keyof ObjectModel>(fieldName: T, value: ObjectModel[T]): ObjectModel[T];
    toModel(model?: Partial<ObjectModel>): ObjectModel;
    /**
     * @returns plain Model for JSON conversion
     */
    toJSON(): ObjectModel;
}
/**
 * Pure generator class with options
 */
export declare class PureGenerator<ObjectModel, Options> extends ModelHandler<ObjectModel> {
    readonly options: Options;
    readonly schemaName: string;
    constructor(model: ObjectModel, options: Options);
    toModel(model?: Partial<ObjectModel>): ObjectModel;
}
/**
 * Pure generator extended with random
 */
export interface RandomGeneratorOptions {
    seed?: number;
    random?: RandomObject;
}
export declare class RandomGenerator<ObjectModel, Options extends RandomGeneratorOptions> extends PureGenerator<ObjectModel, Options> {
    readonly schemaName: string;
    protected readonly random: RandomObject;
    constructor(model: ObjectModel, options: Options);
    toModel(model?: Partial<ObjectModel>): ObjectModel;
}
