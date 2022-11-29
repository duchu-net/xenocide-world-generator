import { decimalToRoman } from "../../utils";
import { BasicModelGenerator } from "../basic-generator";
import { SystemOrbitModel } from "../system-orbits-generator";

export interface EmptyZoneModel {
  name?: string;
  orbit?: SystemOrbitModel;
}
interface EmptyZoneOptions {

}

export class EmptyZone extends BasicModelGenerator<EmptyZoneModel, null> {
  constructor(model: EmptyZoneModel, options = null) {
    super(model, options);
  }

  static getSequentialName(beltIndex: number) {
    return `empty ${decimalToRoman(beltIndex + 1)}`;
  }
}