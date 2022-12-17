import { Vector3 } from 'three';

import { StarModel } from '../star/types';
import { PlanetModel } from '../planet';

import { EmptyZoneModel } from './empty-zone';
import { DebrisBeltModel } from './debris-belt-generator';

export interface SystemModel {
  starColor?: string;
  habitable?: boolean;
  starRadius?: number;
  name?: string;
  position?: Vector3;
  temperature?: number;
  starsSeed?: number;
  planetsSeed?: number;

  stars?: StarModel[];
  orbits?: (PlanetModel | DebrisBeltModel | EmptyZoneModel)[];
  options?: {};
}
