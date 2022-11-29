import { decimalToRoman, RandomObject, Seed } from '../utils';
import { BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { SystemOrbitModel } from './system-orbits-generator';

export interface DebrisBeltOptions extends BasicGeneratorOptions {
  // surfaceSeed?: Seed;
  // random?: RandomObject;
}
const defaultOptions: DebrisBeltOptions = {
  // position: new Vector3(0, 0, 0),
};

export interface DebrisBeltModel {
  id?: string;
  name?: string;
  physic?: {
    mass?: number;
  };
  orbit?: SystemOrbitModel; // OrbitModel;
  options?: {}; // todo generator options???
}

// export interface DebrisBeltGeneratorModel {
//   model?: DebrisBeltModel;
//   options?: DebrisBeltOptions;
// }

export class DebrisBeltGenerator extends ExtendedGenerator<DebrisBeltModel, DebrisBeltOptions> {
  constructor(model: DebrisBeltModel, options: Partial<DebrisBeltOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });
  }

  get subtype(): string {
    // @ts-ignore
    return this.model.orbit.subtype;
  }

  static getSequentialName(beltIndex: number) {
    return `Belt ${decimalToRoman(beltIndex + 1)}`;
  }

  override toModel(): DebrisBeltModel {
    return { ...this.model, options: this.options };
  }
}
