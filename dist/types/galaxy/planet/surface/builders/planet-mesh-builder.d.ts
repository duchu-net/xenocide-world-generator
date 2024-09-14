import { Vector3 } from 'three';
import { RandomObject } from '../../../../utils';
import { RandomGeneratorOptions } from '../../../basic-generator';
import { Mesh } from '../surface.types';
interface Node {
    p: Vector3;
    e: number[];
    f: number[];
}
export interface PlanetMeshModelGen {
}
export interface PlanetMeshOptions extends RandomGeneratorOptions {
}
export declare class PlanetMeshBuilder {
    mesh?: Mesh;
    generatePlanetMesh(icosahedronSubdivision: number, topologyDistortionRate: number, random: RandomObject): Mesh;
    static findNextFaceIndex(mesh: Mesh, nodeIndex: number, faceIndex: number): number;
    static getEdgeOppositeFaceIndex(edge: Mesh['edges'][0], faceIndex: number): number;
    static distortMesh(mesh: Mesh, degree: number, random: RandomObject): boolean;
    static conditionalRotateEdge(mesh: Mesh, edgeIndex: number, predicate: (...args: Node[]) => boolean): boolean;
    static getFaceOppositeNodeIndex(face: Mesh['faces'][0], edge: Mesh['edges'][0]): 2 | 1 | 0;
    static relaxMesh(mesh: Mesh, multiplier: number): number;
    static calculateFaceCentroid(pa: Vector3, pb: Vector3, pc: Vector3): Vector3;
}
export {};
