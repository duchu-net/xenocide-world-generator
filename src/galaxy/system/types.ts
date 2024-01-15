import { Vector3 } from 'three';

import { SystemPhysicModel } from '../physic';
import { OrbitModel } from '../physic/orbit-generator';
import { PlanetModel } from '../planet';
import { StarModel } from '../star/types';

import { DebrisBeltModel } from './debris-belt-generator';
import { EmptyZoneModel } from './empty-zone';

export interface SystemModel {
  id?: string;
  path?: string;
  parentPath?: string;
  name?: string;
  starColor?: string;
  habitable?: boolean;
  starRadius?: number;
  position?: Vector3;
  temperature?: number;

  stars?: StarModel[];
  // orbits?: (PlanetModel | DebrisBeltModel | EmptyZoneModel)[];
  orbits?: OrbitModel[];
  belts?: DebrisBeltModel[];
  planets?: PlanetModel[];
  physic?: SystemPhysicModel;
  options?: {
    seed?: number;
    starsSeed?: number;
    planetsSeed?: number;
  };
}
