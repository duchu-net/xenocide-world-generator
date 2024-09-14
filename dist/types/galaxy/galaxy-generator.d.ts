import { BasicShape } from '../galaxy-shape';
import { GalaxyClass, Position } from '../interfaces';
import { RandomGenerator, RandomGeneratorOptions } from './basic-generator';
import { SystemGenerator, SystemModel } from './system';
export interface GalaxyModel {
    id?: string;
    path?: string;
    systemsSeed?: number;
    name?: string;
    position?: Position;
    classification?: GalaxyClass;
    systems?: SystemModel[];
    options?: {};
}
export interface GalaxyOptions extends RandomGeneratorOptions {
    grid: {
        size: number;
        spacing: number;
    };
    spiral: {
        size: number;
    };
}
export declare class GalaxyGenerator extends RandomGenerator<GalaxyModel, GalaxyOptions> {
    schemaName: string;
    private readonly systems;
    constructor(model: GalaxyModel, options?: Partial<GalaxyOptions>);
    setClassification(classification?: GalaxyClass): void;
    getShape(): BasicShape;
    generateSystems(): Generator<SystemGenerator, void, unknown>;
    toModel(): Required<GalaxyModel>;
}
