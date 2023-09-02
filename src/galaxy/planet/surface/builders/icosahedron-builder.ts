import { Vector3 } from 'three';

import { Mesh, MeshEdge, MeshFace, MeshNode } from '../surface.types';

function slerp(p0: Vector3, p1: Vector3, t: number) {
  const omega = Math.acos(p0.dot(p1));
  return p0
    .clone()
    .multiplyScalar(Math.sin((1 - t) * omega))
    .add(p1.clone().multiplyScalar(Math.sin(t * omega)))
    .divideScalar(Math.sin(omega));
}

const createEdge = (edge: Partial<MeshEdge> & Pick<MeshEdge, 'n'>): MeshEdge => ({
  n: edge.n,
  f: edge.f ?? [],
  subdivided_n: edge.subdivided_n ?? [],
  subdivided_e: edge.subdivided_e ?? [],
});

const noopVector = new Vector3();
const createFace = (face: Partial<MeshFace>): MeshFace => ({
  n: face.n ?? [],
  e: face.e ?? [],
  centroid: face.centroid ?? noopVector,
});

const createNode = (node: Partial<MeshNode> & Pick<MeshNode, 'p'>): MeshNode => ({
  e: node.e ?? [],
  f: node.f ?? [],
  p: node.p,
});

export class IcosahedronBuilder {
  private constructor() {}

  // degree/subdivisions - detail_level
  static generateSubdividedIcosahedron(degree: number = 10): Mesh {
    const icosahedron = IcosahedronBuilder.generateIcosahedron();

    const nodes = icosahedron.nodes.map((node) => createNode({ p: node.p }));

    const edges = [];
    icosahedron.edges.forEach((edge) => {
      const n0 = icosahedron.nodes[edge.n[0]];
      const n1 = icosahedron.nodes[edge.n[1]];
      const p0 = n0.p;
      const p1 = n1.p;
      const delta = p1.clone().sub(p0);
      nodes[edge.n[0]].e.push(edges.length);
      let priorNodeIndex = edge.n[0];
      for (let s = 1; s < degree; ++s) {
        const edgeIndex = edges.length;
        const nodeIndex = nodes.length;
        edge.subdivided_e.push(edgeIndex);
        edge.subdivided_n.push(nodeIndex);
        edges.push(createEdge({ n: [priorNodeIndex, nodeIndex] }));
        priorNodeIndex = nodeIndex;
        nodes.push({ p: slerp(p0, p1, s / degree), e: [edgeIndex, edgeIndex + 1], f: [] });
      }
      edge.subdivided_e.push(edges.length);
      nodes[edge.n[1]].e.push(edges.length);
      edges.push(createEdge({ n: [priorNodeIndex, edge.n[1]] }));
    });

    const faces: MeshFace[] = [];
    for (let i = 0; i < icosahedron.faces.length; ++i) {
      const face = icosahedron.faces[i];
      const edge0 = icosahedron.edges[face.e[0]];
      const edge1 = icosahedron.edges[face.e[1]];
      const edge2 = icosahedron.edges[face.e[2]];
      const point0 = icosahedron.nodes[face.n[0]].p;
      const point1 = icosahedron.nodes[face.n[1]].p;
      const point2 = icosahedron.nodes[face.n[2]].p;
      const delta = point1.clone().sub(point0);

      const getEdgeNode0 = (k: number) =>
        face.n[0] === edge0.n[0] ? edge0.subdivided_n[k] : edge0.subdivided_n[degree - 2 - k];
      const getEdgeNode1 = (k: number) =>
        face.n[1] === edge1.n[0] ? edge1.subdivided_n[k] : edge1.subdivided_n[degree - 2 - k];
      const getEdgeNode2 = (k: number) =>
        face.n[0] === edge2.n[0] ? edge2.subdivided_n[k] : edge2.subdivided_n[degree - 2 - k];

      const faceNodes = [face.n[0]];
      for (let j = 0; j < edge0.subdivided_n.length; ++j) faceNodes.push(getEdgeNode0(j));
      faceNodes.push(face.n[1]);

      for (let s = 1; s < degree; ++s) {
        faceNodes.push(getEdgeNode2(s - 1));
        const p0 = nodes[getEdgeNode2(s - 1)].p;
        const p1 = nodes[getEdgeNode1(s - 1)].p;
        for (let t = 1; t < degree - s; ++t) {
          faceNodes.push(nodes.length);
          nodes.push({ p: slerp(p0, p1, t / (degree - s)), e: [], f: [] });
        }
        faceNodes.push(getEdgeNode1(s - 1));
      }
      faceNodes.push(face.n[2]);

      const getEdgeEdge0 = (k: number) =>
        face.n[0] === edge0.n[0] ? edge0.subdivided_e[k] : edge0.subdivided_e[degree - 1 - k];
      const getEdgeEdge1 = (k: number) =>
        face.n[1] === edge1.n[0] ? edge1.subdivided_e[k] : edge1.subdivided_e[degree - 1 - k];
      const getEdgeEdge2 = (k: number) =>
        face.n[0] === edge2.n[0] ? edge2.subdivided_e[k] : edge2.subdivided_e[degree - 1 - k];

      const faceEdges0 = [];
      for (let j = 0; j < degree; ++j) faceEdges0.push(getEdgeEdge0(j));
      let nodeIndex = degree + 1;
      for (let s = 1; s < degree; ++s) {
        for (let t = 0; t < degree - s; ++t) {
          faceEdges0.push(edges.length);
          const edge = createEdge({ n: [faceNodes[nodeIndex], faceNodes[nodeIndex + 1]] });
          nodes[edge.n[0]].e.push(edges.length);
          nodes[edge.n[1]].e.push(edges.length);
          edges.push(edge);
          ++nodeIndex;
        }
        ++nodeIndex;
      }

      const faceEdges1 = [];
      nodeIndex = 1;
      for (let s = 0; s < degree; ++s) {
        for (let t = 1; t < degree - s; ++t) {
          faceEdges1.push(edges.length);
          const edge = createEdge({ n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s]] });
          nodes[edge.n[0]].e.push(edges.length);
          nodes[edge.n[1]].e.push(edges.length);
          edges.push(edge);
          ++nodeIndex;
        }
        faceEdges1.push(getEdgeEdge1(s));
        nodeIndex += 2;
      }

      const faceEdges2 = [];
      nodeIndex = 1;
      for (let s = 0; s < degree; ++s) {
        faceEdges2.push(getEdgeEdge2(s));
        for (let t = 1; t < degree - s; ++t) {
          faceEdges2.push(edges.length);
          const edge = createEdge({ n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s + 1]] });
          nodes[edge.n[0]].e.push(edges.length);
          nodes[edge.n[1]].e.push(edges.length);
          edges.push(edge);
          ++nodeIndex;
        }
        nodeIndex += 2;
      }

      nodeIndex = 0;
      let edgeIndex = 0;
      for (let s = 0; s < degree; ++s) {
        for (let t = 1; t < degree - s + 1; ++t) {
          const subFace = createFace({
            n: [faceNodes[nodeIndex], faceNodes[nodeIndex + 1], faceNodes[nodeIndex + degree - s + 1]],
            e: [faceEdges0[edgeIndex], faceEdges1[edgeIndex], faceEdges2[edgeIndex]],
          });
          nodes[subFace.n[0]].f.push(faces.length);
          nodes[subFace.n[1]].f.push(faces.length);
          nodes[subFace.n[2]].f.push(faces.length);
          edges[subFace.e[0]].f.push(faces.length);
          edges[subFace.e[1]].f.push(faces.length);
          edges[subFace.e[2]].f.push(faces.length);
          faces.push(subFace);
          ++nodeIndex;
          ++edgeIndex;
        }
        ++nodeIndex;
      }

      nodeIndex = 1;
      edgeIndex = 0;
      for (let s = 1; s < degree; ++s) {
        for (let t = 1; t < degree - s + 1; ++t) {
          const subFace = createFace({
            n: [faceNodes[nodeIndex], faceNodes[nodeIndex + degree - s + 2], faceNodes[nodeIndex + degree - s + 1]],
            e: [faceEdges2[edgeIndex + 1], faceEdges0[edgeIndex + degree - s + 1], faceEdges1[edgeIndex]],
          });
          nodes[subFace.n[0]].f.push(faces.length);
          nodes[subFace.n[1]].f.push(faces.length);
          nodes[subFace.n[2]].f.push(faces.length);
          edges[subFace.e[0]].f.push(faces.length);
          edges[subFace.e[1]].f.push(faces.length);
          edges[subFace.e[2]].f.push(faces.length);
          faces.push(subFace);
          ++nodeIndex;
          ++edgeIndex;
        }
        nodeIndex += 2;
        edgeIndex += 1;
      }
    }
    return { nodes, edges, faces };
  }

  static generateIcosahedron(): Mesh {
    const phi = (1.0 + Math.sqrt(5.0)) / 2.0;
    const du = 1.0 / Math.sqrt(phi * phi + 1.0);
    const dv = phi * du;

    const nodes: MeshNode[] = [
      { p: new Vector3(0, +dv, +du) },
      { p: new Vector3(0, +dv, -du) },
      { p: new Vector3(0, -dv, +du) },
      { p: new Vector3(0, -dv, -du) },
      { p: new Vector3(+du, 0, +dv) },
      { p: new Vector3(-du, 0, +dv) },
      { p: new Vector3(+du, 0, -dv) },
      { p: new Vector3(-du, 0, -dv) },
      { p: new Vector3(+dv, +du, 0) },
      { p: new Vector3(+dv, -du, 0) },
      { p: new Vector3(-dv, +du, 0) },
      { p: new Vector3(-dv, -du, 0) },
    ].map(createNode);

    const edges: MeshEdge[] = [
      { n: [0, 1] },
      { n: [0, 4] },
      { n: [0, 5] },
      { n: [0, 8] },
      { n: [0, 10] },
      { n: [1, 6] },
      { n: [1, 7] },
      { n: [1, 8] },
      { n: [1, 10] },
      { n: [2, 3] },
      { n: [2, 4] },
      { n: [2, 5] },
      { n: [2, 9] },
      { n: [2, 11] },
      { n: [3, 6] },
      { n: [3, 7] },
      { n: [3, 9] },
      { n: [3, 11] },
      { n: [4, 5] },
      { n: [4, 8] },
      { n: [4, 9] },
      { n: [5, 10] },
      { n: [5, 11] },
      { n: [6, 7] },
      { n: [6, 8] },
      { n: [6, 9] },
      { n: [7, 10] },
      { n: [7, 11] },
      { n: [8, 9] },
      { n: [10, 11] },
    ].map(createEdge);

    const faces: MeshFace[] = [
      { n: [0, 1, 8], e: [0, 7, 3] },
      { n: [0, 4, 5], e: [1, 18, 2] },
      { n: [0, 5, 10], e: [2, 21, 4] },
      { n: [0, 8, 4], e: [3, 19, 1] },
      { n: [0, 10, 1], e: [4, 8, 0] },
      { n: [1, 6, 8], e: [5, 24, 7] },
      { n: [1, 7, 6], e: [6, 23, 5] },
      { n: [1, 10, 7], e: [8, 26, 6] },
      { n: [2, 3, 11], e: [9, 17, 13] },
      { n: [2, 4, 9], e: [10, 20, 12] },
      { n: [2, 5, 4], e: [11, 18, 10] },
      { n: [2, 9, 3], e: [12, 16, 9] },
      { n: [2, 11, 5], e: [13, 22, 11] },
      { n: [3, 6, 7], e: [14, 23, 15] },
      { n: [3, 7, 11], e: [15, 27, 17] },
      { n: [3, 9, 6], e: [16, 25, 14] },
      { n: [4, 8, 9], e: [19, 28, 20] },
      { n: [5, 11, 10], e: [22, 29, 21] },
      { n: [6, 9, 8], e: [25, 28, 24] },
      { n: [7, 10, 11], e: [26, 29, 27] },
    ].map(createFace);

    for (let i = 0; i < edges.length; ++i) for (let j = 0; j < edges[i].n.length; ++j) nodes[j].e.push(i);
    for (let i = 0; i < faces.length; ++i) for (let j = 0; j < faces[i].n.length; ++j) nodes[j].f.push(i);
    for (let i = 0; i < faces.length; ++i) for (let j = 0; j < faces[i].e.length; ++j) edges[j].f.push(i);

    return { nodes, edges, faces };
  }
}
