import MarkovModel from './MarkovModel';
export declare class MarkovModelBuilder {
    private _order;
    private _startingStrings;
    private _productions;
    constructor(_order: number);
    TeachArray(examples: string[]): this;
    Teach(example: string): this;
    toModel(): MarkovModel;
    Normalize(stringCounts?: Map<string, number>): (readonly [string, number])[];
    Increment(key: string, value: string): void;
    static AddOrUpdateMap(map: Map<string, number>, key: string, value: number, update: (value: number) => number): void;
}
