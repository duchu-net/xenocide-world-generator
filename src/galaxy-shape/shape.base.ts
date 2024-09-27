import type { RandomObject } from '../utils';
import type { Protostar } from './Protostar';

export abstract class ShapeBase {
  abstract Generate(random?: RandomObject): IterableIterator<Protostar>;
}
