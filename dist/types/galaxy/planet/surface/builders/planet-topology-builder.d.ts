import { Mesh, Topology } from '../surface.types';
export declare class PlanetTopologyBuilder {
    maxDistanceToCorner?: number;
    generatePlanetTopology(mesh: Mesh): Topology;
}
