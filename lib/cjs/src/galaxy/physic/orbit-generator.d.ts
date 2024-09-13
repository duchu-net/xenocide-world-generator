import { RandomObject } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { OrbitPhysicModel, SystemZone } from './orbit-physic';
import { StarPhysicModel } from './star-physic';
declare enum SystemBodyType {
    EMPTY = "EMPTY",
    PLANET = "PLANET",
    ASTEROID_BELT = "ASTEROID_BELT"
}
export interface OrbitModel extends OrbitPhysicModel {
    schemaName?: 'orbit-model';
    /** zone in system */
    zone?: SystemZone;
    /** orbiting body type */
    bodyType?: SystemBodyType;
}
interface OrbitOptions extends RandomGeneratorOptions {
    maxInclinationDeg: number;
}
export declare class OrbitGenerator extends RandomGenerator<OrbitModel, OrbitOptions> {
    schemaName: string;
    protected tags: string[];
    protected lock: boolean;
    constructor(model: OrbitModel, options?: Partial<OrbitOptions>);
    generateOrbit(): void;
    setTags(tags: string[]): void;
    hasTag(tagName: string): boolean;
    lockTag(tags: OrbitGenerator['tags'] | OrbitGenerator['tags'][0]): void;
    markAsEmpty(): void;
    generateType(random: RandomObject): void;
}
export declare const ORBIT_OBJECT_TYPES: {
    type: OrbitModel['bodyType'];
    probability: number;
    when: (star: StarPhysicModel, orbit: OrbitPhysicModel) => boolean;
}[];
export {};
