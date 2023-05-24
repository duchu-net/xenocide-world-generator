import { Seed } from '../../utils';
import { Vector3 } from 'three';
import { PlanetPhysicModel } from '../physic';
import { SystemOrbitModel } from '../system';

export enum RegionBiome {
  Ocean = 'ocean',
}

export interface RegionModel {
  id: string;
  biome?: RegionBiome;
  color?: string;
  corners: Vector3[];
  neighbors: string[];
  effects?: {}[];
}

export interface PlanetModel {
  id?: string;
  name?: string;
  path?: string;
  parentPath?: string;
  // type?: string;
  radius?: number;
  surfaceSeed?: Seed;
  physic?: PlanetPhysicModel & SystemOrbitModel;
  // orbit?: SystemOrbitModel; // OrbitModel;
  regions?: RegionModel[];
  options?: {}; // todo generator options???

  type?:
    | 'lava'
    | 'rocky'
    | 'terran'
    | 'coreless-watery'
    | 'watery'
    | 'icy'
    | 'hot_icy'
    | 'super_mercury'
    | 'puffy_giant'
    | 'jupiter'
    | 'hot_jupiter'
    | 'super_jupiter'
    | 'gas_dwarf'
    | 'ice_giant';
  subType?: 'terrestial' | 'liquid' | 'ice';
  schemaName?: 'PlanetModel';
}
