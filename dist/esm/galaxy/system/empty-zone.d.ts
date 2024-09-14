import { ModelHandler } from '../basic-generator';
import { SystemOrbitModel } from './system-orbits-generator';
export interface EmptyZoneModel {
    id?: string;
    name?: string;
    path?: string;
    orbit?: SystemOrbitModel;
    type?: string;
    subType?: string;
    schemaName?: 'EmptyZoneModel';
}
export declare class EmptyZone extends ModelHandler<EmptyZoneModel> {
    schemaName: string;
    static getSequentialName(beltIndex: number): string;
}
