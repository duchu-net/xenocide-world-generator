import { MarkovModel } from './MarkovNames/MarkovModel';
import { RandomObject } from './RandomObject';
export declare class StarName {
    private constructor();
    static instance?: MarkovModel;
    static getInstance(): MarkovModel;
    static _prefixStrategies: (number | typeof StarName.Decorator)[][];
    static _suffixStrategies: (number | typeof StarName.Decorator)[][];
    static _namingStrategies: (number | typeof StarName.NamedStar)[][];
    static specialLocations: string[];
    static greekLetters: string[];
    static decorators: string[];
    static Greek(random: RandomObject): any;
    static Decorator(random: RandomObject): any;
    static RomanNumeral(random: RandomObject): string;
    static Integer(random: RandomObject): number;
    static Decimal(random: RandomObject): number;
    static Letter(random: RandomObject): string;
    static PlainMarkov(random: RandomObject): string;
    static NamedStar(random: RandomObject): any;
    static WithDecoration(probability: number, func: (random: RandomObject) => string): (random: RandomObject) => string;
    static ToRoman(number: number): string;
    static Generate(random: RandomObject): any;
    static GenerateCount(random: RandomObject, count?: number): Promise<any[]>;
}
export default StarName;
