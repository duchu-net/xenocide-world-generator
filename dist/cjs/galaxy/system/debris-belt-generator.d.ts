import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { SystemOrbitModel } from './system-orbits-generator';
export interface DebrisBeltOptions extends RandomGeneratorOptions {
}
export interface DebrisBeltModel {
    id?: string;
    name?: string;
    path?: string;
    parentPath?: string;
    type?: string;
    subType?: string;
    physic?: {
        mass?: number;
    };
    orbit?: SystemOrbitModel;
    options?: {};
    schemaName?: 'DebrisBeltModel';
}
export declare class DebrisBeltGenerator extends RandomGenerator<DebrisBeltModel, DebrisBeltOptions> {
    schemaName: string;
    constructor(model: DebrisBeltModel, options?: Partial<DebrisBeltOptions>);
    get subtype(): string;
    static getSequentialName(beltIndex: number): string;
    toModel(): DebrisBeltModel;
}
