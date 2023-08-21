import { decimalToRoman } from '../../utils';

import { ModelHandler } from '../basic-generator';

import { SystemOrbitModel } from './system-orbits-generator';

export interface EmptyZoneModel {
  id?: string;
  name?: string;
  path?: string;
  orbit?: SystemOrbitModel;
  type?: string; // not used
  subType?: string; // not used
  schemaName?: 'EmptyZoneModel';
}

export class EmptyZone extends ModelHandler<EmptyZoneModel> {
  override schemaName = 'EmptyZoneModel';

  static getSequentialName(beltIndex: number) {
    return `empty ${decimalToRoman(beltIndex + 1)}`;
  }
}
