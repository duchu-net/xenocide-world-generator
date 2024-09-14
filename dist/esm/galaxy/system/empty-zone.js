import { decimalToRoman } from '../../utils';
import { ModelHandler } from '../basic-generator';
export class EmptyZone extends ModelHandler {
    constructor() {
        super(...arguments);
        this.schemaName = 'EmptyZoneModel';
    }
    static getSequentialName(beltIndex) {
        return `empty ${decimalToRoman(beltIndex + 1)}`;
    }
}
