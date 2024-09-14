import { RandomObject } from '../RandomObject';
export declare class MarkovModel {
    order: number;
    startingStrings: Map<string, number>;
    productions: Map<string, Map<string, number>>;
    constructor(order: number, startingStrings?: Map<string, number>, productions?: Map<string, Map<string, number>>);
    Generate(random: RandomObject): string;
    static WeightedRandom(random: RandomObject, _items?: Map<string, number>): string;
}
export default MarkovModel;
