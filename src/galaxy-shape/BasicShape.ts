import { RandomObject } from '../utils';

export abstract class BasicShape {
  abstract Generate(random?: RandomObject): IterableIterator<any>;
}
