import { RandomObject } from '../utils';
import { ShapeStar } from './ShapeStar';
export declare abstract class BasicShape {
    abstract Generate(random?: RandomObject): IterableIterator<ShapeStar>;
}
