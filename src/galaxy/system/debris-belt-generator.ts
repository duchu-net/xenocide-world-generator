import { codename, decimalToRoman } from '../../utils';
import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { SystemOrbitModel } from './system-orbits-generator';

export interface DebrisBeltOptions extends RandomGeneratorOptions {
  // surfaceSeed?: Seed;
  // random?: RandomObject;
}
const defaultOptions: DebrisBeltOptions = {
  // position: new Vector3(0, 0, 0),
};

export interface DebrisBeltModel {
  id?: string;
  name?: string;
  path?: string;
  parentPath?: string;
  type?: string; // todo eg. icy, iron, etc.?
  subType?: string; // todo dust - planet ring, rocky - big
  physic?: {
    mass?: number;
  };
  orbit?: SystemOrbitModel; // OrbitModel;
  options?: {}; // todo generator options???
  schemaName?: 'DebrisBeltModel';
}

// export interface DebrisBeltGeneratorModel {
//   model?: DebrisBeltModel;
//   options?: DebrisBeltOptions;
// }

export class DebrisBeltGenerator extends RandomGenerator<DebrisBeltModel, DebrisBeltOptions> {
  override schemaName = 'DebrisBeltModel';

  constructor(model: DebrisBeltModel, options: Partial<DebrisBeltOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.id) this.model.id = codename(this.model.name);
    if (!model.path) this.model.path = `${this.model.parentPath}/b:${this.model.id}`;
  }

  get subtype(): string {
    // @ts-ignore
    return this.model.orbit.subtype;
  }

  static getSequentialName(beltIndex: number) {
    return `Belt ${decimalToRoman(beltIndex + 1)}`;
  }

  override toModel(): DebrisBeltModel {
    return super.toModel({ options: this.options });
  }
}
