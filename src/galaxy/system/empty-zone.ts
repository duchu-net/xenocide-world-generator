import { decimalToRoman } from '../../utils';
import { ModelHandler } from '../basic-generator';
import { SystemOrbitModel } from '../system-orbits-generator';

export interface EmptyZoneModel {
  name?: string;
  orbit?: SystemOrbitModel;
}

export class EmptyZone extends ModelHandler<EmptyZoneModel> {
  override schemaName = 'EmptyZoneModel';

  static getSequentialName(beltIndex: number) {
    return `empty ${decimalToRoman(beltIndex + 1)}`;
  }
}
