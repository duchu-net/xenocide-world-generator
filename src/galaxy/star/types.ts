import { StarPath, SystemPath } from '../../global.types';
import { StarPhysicModel, StarStellarClass } from '../physic/star-physic';

type Star = {
  id: string;
  path: StarPath;
  parentPath: SystemPath;
  mass: number;
  spectralClass: StarStellarClass;
  name: string;
  physic: StarPhysicModel;
  options: {};
};

export type StarModel = Partial<Star>;
