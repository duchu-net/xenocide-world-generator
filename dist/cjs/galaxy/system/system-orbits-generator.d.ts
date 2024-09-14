import { RandomObject, Seed } from '../../utils';
import { RandomGenerator } from '../basic-generator';
import { OrbitGenerator, OrbitModel } from '../physic/orbit-generator';
import { StarModel } from '../star';
interface SystemOrbitOptions {
    seed?: Seed;
    random?: RandomObject;
    prefer_habitable?: boolean;
    star: StarModel;
}
export interface SystemOrbitModel extends Partial<OrbitModel> {
    options?: Partial<SystemOrbitOptions>;
    order?: number;
}
export declare class SystemOrbitsGenerator extends RandomGenerator<SystemOrbitModel, SystemOrbitOptions> {
    orbits: OrbitGenerator[];
    topology?: string;
    beetwen_orbits_factor: number[];
    modyficators: (typeof SystemOrbitsGenerator.ClassicSystem | typeof SystemOrbitsGenerator.HabitableMoonSystem)[];
    constructor(model: SystemOrbitModel, options: SystemOrbitOptions);
    generateOrbits(): IterableIterator<OrbitGenerator>;
    build(): boolean;
    generateTopology(): void;
    generateProtoOrbits(): void;
    fillOrbitZone(): void;
    fillOrbitPeriod(): void;
    static ClassicSystem(random: RandomObject, { prefer_habitable }: {
        prefer_habitable?: boolean;
    }): (systemOrbit: SystemOrbitsGenerator) => void;
    static HabitableMoonSystem(random: RandomObject): (planetOrbit: SystemOrbitsGenerator) => void;
}
export {};
