import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { StarPhysicModel, StarStellarClass, StarStellarClassData } from '../physic';
import { StarModel } from './types';
interface StarOptions extends RandomGeneratorOptions {
}
export declare class StarGenerator extends RandomGenerator<StarModel, StarOptions> {
    physic: StarPhysicModel;
    private meta;
    constructor(model: StarModel, options?: Partial<StarOptions>);
    /** Get Star mass */
    mass(): number;
    /** Set Star mass */
    mass(mass: number): this;
    /** Get Star name */
    name(): string;
    /** Set Star name */
    name(starName: string): this;
    /** Set Star name based on System name and Star sequence */
    name(systemName: string, sequenceIndex: number): this;
    private initializeNaming;
    private initializePhysic;
    toModel(): {
        physic: StarPhysicModel;
        meta: StarStellarClassData;
        id?: string;
        path?: import("../..").StarPath;
        parentPath?: import("../..").SystemPath;
        mass?: number;
        spectralClass?: StarStellarClass;
        name?: string;
        options?: {};
    };
    static getSequentialName(systemName: string, starIndex: number, standarize?: boolean): string;
    static sortByMass(stars: StarGenerator[]): StarGenerator[];
}
export {};
