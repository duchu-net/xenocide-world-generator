import { Vector3 } from 'three';

import { Border, Corner, SpatialPartition, Tile } from './utils';

export interface MeshEdge {
  n: number[];
  f: number[];
  subdivided_n: number[];
  subdivided_e: number[];
}
export interface MeshFace {
  n: number[];
  e: number[];
  centroid: Vector3;
}
export interface MeshNode {
  p: Vector3;
  e: number[];
  f: number[];
}
export interface Mesh {
  nodes: MeshNode[];
  edges: MeshEdge[];
  faces: MeshFace[];
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
