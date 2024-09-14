"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyZone = void 0;
const utils_1 = require("../../utils");
const basic_generator_1 = require("../basic-generator");
class EmptyZone extends basic_generator_1.ModelHandler {
    constructor() {
        super(...arguments);
        this.schemaName = 'EmptyZoneModel';
    }
    static getSequentialName(beltIndex) {
        return `empty ${(0, utils_1.decimalToRoman)(beltIndex + 1)}`;
    }
}
exports.EmptyZone = EmptyZone;
