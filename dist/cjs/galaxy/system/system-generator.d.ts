import { Vector3 } from 'three';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { StarStellarClass, SystemPhysicModel } from '../physic';
import { PlanetGenerator } from '../planet';
import { StarGenerator } from '../star';
import { DebrisBeltGenerator } from './debris-belt-generator';
import { EmptyZone } from './empty-zone';
import { SystemModel } from './types';
type OnOrbitGenerator = PlanetGenerator | DebrisBeltGenerator | EmptyZone;
interface SystemOptions extends RandomGeneratorOptions {
    starsSeed: number;
    planetsSeed: number;
    prefer_habitable: boolean;
    planetsCount?: number;
    spectralClass?: StarStellarClass;
}
export declare class SystemGenerator extends RandomGenerator<SystemModel, SystemOptions> {
    schemaName: string;
    readonly stars: StarGenerator[];
    readonly orbits: Required<SystemModel>['orbits'];
    readonly belts: DebrisBeltGenerator[];
    readonly planets: PlanetGenerator[];
    physic: SystemPhysicModel;
    constructor(model: SystemModel, options?: Partial<SystemOptions>);
    get name(): string;
    get position(): Vector3;
    generateStars(): IterableIterator<StarGenerator>;
    private getStarsModels;
    generatePlanets(): IterableIterator<OnOrbitGenerator>;
    private generateOrbits;
    toModel(): SystemModel;
}
export {};
