import { Vector3 } from "three";

import { Border, Corner, SpatialPartition, Tile } from "./utils";

export interface Mesh {
  nodes: { p: Vector3; e: number[]; f: number[] }[];
  edges: { n: number[]; f: number[]; subdivided_n?: number[]; subdivided_e?: number[] }[];
  faces: { n: number[]; e: number[]; centroid?: Vector3 }[];
}

export interface Topology {
  corners: Corner[];
  borders: Border[];
  tiles: Tile[];
}

export interface PlanetSurface {
  mesh: Mesh;
  topology: Topology;
  plates: any[];
  partition: SpatialPartition;
}
