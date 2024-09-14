import { Mesh } from '../surface.types';
export declare class IcosahedronBuilder {
    private constructor();
    static generateSubdividedIcosahedron(degree?: number): Mesh;
    static generateIcosahedron(): Mesh;
}
