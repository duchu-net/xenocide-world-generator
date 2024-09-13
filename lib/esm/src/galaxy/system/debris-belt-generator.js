import { codename, decimalToRoman } from '../../utils';
import { RandomGenerator } from '../basic-generator';
const defaultOptions = {
// position: new Vector3(0, 0, 0),
};
// export interface DebrisBeltGeneratorModel {
//   model?: DebrisBeltModel;
//   options?: DebrisBeltOptions;
// }
export class DebrisBeltGenerator extends RandomGenerator {
    constructor(model, options = defaultOptions) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'DebrisBeltModel';
        if (!model.id)
            this.model.id = codename(this.model.name);
        if (!model.path)
            this.model.path = `${this.model.parentPath}/b:${this.model.id}`;
    }
    get subtype() {
        // @ts-ignore
        return this.model.orbit.subtype;
    }
    static getSequentialName(beltIndex) {
        return `Belt ${decimalToRoman(beltIndex + 1)}`;
    }
    toModel() {
        return super.toModel({ options: this.options });
    }
}
//# sourceMappingURL=debris-belt-generator.js.map