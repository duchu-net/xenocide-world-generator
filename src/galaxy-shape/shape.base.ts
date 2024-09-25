import type { RandomObject } from '../utils';
import type { StarEssential } from './star-essential';

export abstract class ShapeBase {
  abstract Generate(random?: RandomObject): IterableIterator<StarEssential>;
}
