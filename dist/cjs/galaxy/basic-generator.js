"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGenerator = exports.PureGenerator = exports.ModelHandler = void 0;
const utils_1 = require("../utils");
/**
 * Basic class to handle model logic
 */
class ModelHandler {
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
exports.ModelHandler = ModelHandler;
/**
 * Pure generator class with options
 */
class PureGenerator extends ModelHandler {
    constructor(model, options) {
        super(model);
        this.options = options;
        this.schemaName = 'noname-pure-generator';
    }
    toModel(model = {}) {
        return super.toModel(Object.assign({ options: this.options }, model));
    }
}
exports.PureGenerator = PureGenerator;
class RandomGenerator extends PureGenerator {
    constructor(model, options) {
        super(model, options);
        this.schemaName = 'unnamed-basic-model-generator';
        if (!options.seed)
            this.options.seed = Date.now(); // todo we get same seeds for many items created asynchronously
        this.random = options.random || new utils_1.RandomObject(this.options.seed);
    }
    toModel(model = {}) {
        const _a = this.options, { random } = _a, options = __rest(_a, ["random"]); // exclude RandomObject
        return super.toModel(Object.assign({ options }, model));
    }
}
exports.RandomGenerator = RandomGenerator;
