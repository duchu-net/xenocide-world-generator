"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebrisBeltGenerator = void 0;
const utils_1 = require("../../utils");
const basic_generator_1 = require("../basic-generator");
const defaultOptions = {
// position: new Vector3(0, 0, 0),
};
// export interface DebrisBeltGeneratorModel {
//   model?: DebrisBeltModel;
//   options?: DebrisBeltOptions;
// }
class DebrisBeltGenerator extends basic_generator_1.RandomGenerator {
    constructor(model, options = defaultOptions) {
        super(model, Object.assign(Object.assign(Object.assign({}, defaultOptions), model.options), options));
        this.schemaName = 'DebrisBeltModel';
        if (!model.id)
            this.model.id = (0, utils_1.codename)(this.model.name);
        if (!model.path)
            this.model.path = `${this.model.parentPath}/b:${this.model.id}`;
    }
    get subtype() {
        // @ts-ignore
        return this.model.orbit.subtype;
    }
    static getSequentialName(beltIndex) {
        return `Belt ${(0, utils_1.decimalToRoman)(beltIndex + 1)}`;
    }
    toModel() {
        return super.toModel({ options: this.options });
    }
}
exports.DebrisBeltGenerator = DebrisBeltGenerator;
//# sourceMappingURL=debris-belt-generator.js.map