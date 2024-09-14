import { Vector3 } from 'three';
import { PlanetPath, SystemPath } from '../../global.types';
import { Seed } from '../../utils';
import { PlanetPhysicModel } from '../physic';
import { SystemOrbitModel } from '../system';
export declare enum RegionBiome {
    Ocean = "ocean"
}
export interface RegionModel {
    id: string;
    path: string;
    biome?: RegionBiome;
    color?: string;
    corners: Vector3[];
    neighbors: string[];
    effects?: {}[];
}
export interface PlanetModel {
    id?: string;
    name?: string;
    path?: PlanetPath;
    parentPath?: SystemPath;
    radius?: number;
    physic?: PlanetPhysicModel;
    orbit?: SystemOrbitModel;
    regions?: RegionModel[];
    options?: {
        seed?: Seed;
        surfaceSeed?: Seed;
    };
    type?: 'lava' | 'rocky' | 'terran' | 'coreless-watery' | 'watery' | 'icy' | 'hot_icy' | 'super_mercury' | 'puffy_giant' | 'jupiter' | 'hot_jupiter' | 'super_jupiter' | 'gas_dwarf' | 'ice_giant';
    subType?: 'terrestial' | 'liquid' | 'ice';
    schemaName?: 'PlanetModel';
}
