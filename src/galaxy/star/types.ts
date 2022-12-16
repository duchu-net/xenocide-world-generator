import { StarStellarClass, StarPhysicModel } from '../physic/star-physic';

export interface StarModel {
  mass?: number;
  spectralClass?: StarStellarClass;
  name?: string;
  physic?: StarPhysicModel;
  options?: {};
}
