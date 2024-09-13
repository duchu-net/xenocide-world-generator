var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { RandomObject } from '../utils';
/**
 * Basic class to handle model logic
 */
export class ModelHandler {
    constructor(model) {
        this.model = model;
        this.schemaName = 'noname-model';
    }
    /**
     * update stored model with value
     * @param fieldName key name in model
     * @param value value to insert into Model[fieldName]
     * @return inserted value
     */
    updateModel(fieldName, value) {
        this.model[fieldName] = value;
        return this.model[fieldName];
    }
    toModel(model = {}) {
        return Object.assign(Object.assign({ schemaName: this.schemaName }, this.model), model);
    }
    /**
     * @returns plain Model for JSON conversion
     */
    toJSON() {
        return this.toModel();
    }
}
/**
 * Pure generator class with options
 */
export class PureGenerator extends ModelHandler {
    constructor(model, options) {
        super(model);
        this.options = options;
        this.schemaName = 'noname-pure-generator';
    }
    toModel(model = {}) {
        return super.toModel(Object.assign({ options: this.options }, model));
    }
}
export class RandomGenerator extends PureGenerator {
    constructor(model, options) {
        super(model, options);
        this.schemaName = 'unnamed-basic-model-generator';
        if (!options.seed)
            this.options.seed = Date.now(); // todo we get same seeds for many items created asynchronously
        this.random = options.random || new RandomObject(this.options.seed);
    }
    toModel(model = {}) {
        const _a = this.options, { random } = _a, options = __rest(_a, ["random"]); // exclude RandomObject
        return super.toModel(Object.assign({ options }, model));
    }
}
//# sourceMappingURL=basic-generator.js.map