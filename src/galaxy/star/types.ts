import { StarPath, SystemPath } from '../../global.types';
import { StarPhysicModel,StarStellarClass } from '../physic/star-physic';

export interface StarModel {
  id?: string;
  path?: StarPath;
  parentPath?: SystemPath;
  mass?: number;
  spectralClass?: StarStellarClass;
  name?: string;
  physic?: StarPhysicModel;
  options?: {};
}
