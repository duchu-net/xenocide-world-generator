import { StarStellarClass, StarPhysicModel } from '../physic/star-physic';

export interface StarModel {
  id?: string;
  path?: string;
  parentPath?: string;
  mass?: number;
  spectralClass?: StarStellarClass;
  name?: string;
  physic?: StarPhysicModel;
  options?: {};
}
