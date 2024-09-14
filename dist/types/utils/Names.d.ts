import { MarkovModel } from './MarkovNames';
import RandomObject from './RandomObject';
export declare class Names {
    private constructor();
    static names: string[];
    static specialLocations: string[];
    static greekLetters: string[];
    static decorators: string[];
    static PlainMarkovT(destination: MarkovModel, names: string[]): (random: RandomObject) => string;
    static Named(names: string[]): (random: RandomObject) => any;
    static _system_markov: MarkovModel;
    static get systemNamingStrategies(): (number | ((random: RandomObject) => any))[][];
    static GenerateSystemName(random: RandomObject, count?: number): any;
    static _galaxy_markov: MarkovModel;
    static getGalaxyNamingStrategies(): (number | ((random: RandomObject) => any))[][];
    static GenerateGalaxyName(random: RandomObject, count?: number): string;
    static _markov: MarkovModel;
    static get namingStrategies(): (number | ((random: RandomObject) => any))[][];
    static Generate(random: RandomObject, count?: number): any;
}
declare const _default: undefined;
export default _default;
