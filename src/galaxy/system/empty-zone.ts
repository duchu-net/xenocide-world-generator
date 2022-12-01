import { decimalToRoman } from '../../utils';
import { BasicModelGenerator } from '../basic-generator';
import { SystemOrbitModel } from '../system-orbits-generator';

export interface EmptyZoneModel {
  name?: string;
  orbit?: SystemOrbitModel;
}

export class EmptyZone extends BasicModelGenerator<EmptyZoneModel, null> {
  override schemaName = 'EmptyZoneModel';
  constructor(model: EmptyZoneModel, options = null) {
    super(model, options);
  }

  static getSequentialName(beltIndex: number) {
    return `empty ${decimalToRoman(beltIndex + 1)}`;
  }
}
