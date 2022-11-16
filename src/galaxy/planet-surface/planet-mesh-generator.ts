import * as THREE from 'three';
import { Plane, Vector3 } from 'three';
import { RandomObject } from '../../utils';

import { BasicGeneratorOptions, ExtendedGenerator } from '../basic-generator';
import { IcosahedronGenerator } from './icosahedron-generator';
import { Mesh } from './utils';

interface Node {
  p: Vector3;
  e: number[];
  f: number[];
}

export interface PlanetMeshModelGen {
  // mass?: number;
  // spectralClass?: StarStellarClass;
  // name?: string;
  // physic?: StarPhysicModel;
  // options?: {};
}

export interface PlanetMeshOptions extends BasicGeneratorOptions {
  // name?: string;
  // temperature?: number;
}

const defaultOptions: PlanetMeshOptions = {
  // seed: 999,
};

export class PlanetMeshGenerator {
  mesh?: Mesh;

  // override toModel() {
  //   return { ...this.model };
  // }

  generatePlanetMesh(icosahedronSubdivision: number, topologyDistortionRate: number, random: RandomObject) {
    const mesh = IcosahedronGenerator.generateSubdividedIcosahedron(icosahedronSubdivision);
    this.mesh = mesh;

    // Distorting Triangle Mesh
    let totalDistortion = Math.ceil(mesh.edges.length * topologyDistortionRate);
    let remainingIterations = 6;
    while (remainingIterations !== 0) {
      const iterationDistortion = Math.floor(totalDistortion / remainingIterations);
      totalDistortion -= iterationDistortion;
      PlanetMeshGenerator.distortMesh(mesh, iterationDistortion, random);
      PlanetMeshGenerator.relaxMesh(mesh, 0.5);
      --remainingIterations;
    }

    // Relaxing Triangle Mesh
    const averageNodeRadius = Math.sqrt((4 * Math.PI) / mesh.nodes.length);
    const minShiftDelta = (averageNodeRadius / 50000) * mesh.nodes.length;
    let priorShift;
    let shiftDelta;
    let currentShift = PlanetMeshGenerator.relaxMesh(mesh, 0.5);
    let index = 0;
    do {
      priorShift = currentShift;
      currentShift = PlanetMeshGenerator.relaxMesh(mesh, 0.5);
      shiftDelta = Math.abs(currentShift - priorShift);
      index += 1;
    } while (shiftDelta >= minShiftDelta && index < 300);

    // Calculating Triangle Centroids
    mesh.faces.forEach((face) => {
      const p0 = mesh.nodes[face.n[0]].p;
      const p1 = mesh.nodes[face.n[1]].p;
      const p2 = mesh.nodes[face.n[2]].p;
      face.centroid = PlanetMeshGenerator.calculateFaceCentroid(p0, p1, p2).normalize();
    });

    // Reordering Triangle Nodes
    mesh.nodes.forEach((node, index) => {
      let faceIndex = node.f[0];
      for (let j = 1; j < node.f.length - 1; ++j) {
        faceIndex = PlanetMeshGenerator.findNextFaceIndex(mesh, index, faceIndex);
        const k = node.f.indexOf(faceIndex);
        node.f[k] = node.f[j];
        node.f[j] = faceIndex;
      }
    });

    return this.mesh;
  }

  static findNextFaceIndex(mesh: Mesh, nodeIndex: number, faceIndex: number) {
    const node = mesh.nodes[nodeIndex];
    const face = mesh.faces[faceIndex];
    const nodeFaceIndex = face.n.indexOf(nodeIndex);
    const edge = mesh.edges[face.e[(nodeFaceIndex + 2) % 3]];
    return PlanetMeshGenerator.getEdgeOppositeFaceIndex(edge, faceIndex);
  }

  static getEdgeOppositeFaceIndex(edge: Mesh['edges'][0], faceIndex: number) {
    if (edge.f[0] === faceIndex) return edge.f[1];
    if (edge.f[1] === faceIndex) return edge.f[0];
    throw 'Given face is not part of given edge.';
  }

  static distortMesh(mesh: Mesh, degree: number, random: RandomObject) {
    const totalSurfaceArea = 4 * Math.PI;
    const idealFaceArea = totalSurfaceArea / mesh.faces.length;
    const idealEdgeLength = Math.sqrt((idealFaceArea * 4) / Math.sqrt(3));
    const idealFaceHeight = (idealEdgeLength * Math.sqrt(3)) / 2;

    const rotationPredicate = function (oldNode0: Node, oldNode1: Node, newNode0: Node, newNode1: Node) {
      if (newNode0.f.length >= 7 || newNode1.f.length >= 7 || oldNode0.f.length <= 5 || oldNode1.f.length <= 5)
        return false;
      const oldEdgeLength = oldNode0.p.distanceTo(oldNode1.p);
      const newEdgeLength = newNode0.p.distanceTo(newNode1.p);
      const ratio = oldEdgeLength / newEdgeLength;
      if (ratio >= 2 || ratio <= 0.5) return false;
      const v0 = oldNode1.p.clone().sub(oldNode0.p).divideScalar(oldEdgeLength);
      const v1 = newNode0.p.clone().sub(oldNode0.p).normalize();
      const v2 = newNode1.p.clone().sub(oldNode0.p).normalize();
      if (v0.dot(v1) < 0.2 || v0.dot(v2) < 0.2) return false;
      v0.negate();
      const v3 = newNode0.p.clone().sub(oldNode1.p).normalize();
      const v4 = newNode1.p.clone().sub(oldNode1.p).normalize();
      if (v0.dot(v3) < 0.2 || v0.dot(v4) < 0.2) return false;
      return true;
    };

    let i = 0;
    while (i < degree) {
      let consecutiveFailedAttempts = 0;
      let edgeIndex = random.integerExclusive(0, mesh.edges.length);
      while (!PlanetMeshGenerator.conditionalRotateEdge(mesh, edgeIndex, rotationPredicate)) {
        if (++consecutiveFailedAttempts >= mesh.edges.length) return false;
        edgeIndex = (edgeIndex + 1) % mesh.edges.length;
      }
      ++i;
    }

    return true;
  }

  static conditionalRotateEdge(mesh: Mesh, edgeIndex: number, predicate: (...args: Node[]) => boolean) {
    const edge = mesh.edges[edgeIndex];
    const face0 = mesh.faces[edge.f[0]];
    const face1 = mesh.faces[edge.f[1]];
    const farNodeFaceIndex0 = PlanetMeshGenerator.getFaceOppositeNodeIndex(face0, edge);
    const farNodeFaceIndex1 = PlanetMeshGenerator.getFaceOppositeNodeIndex(face1, edge);
    const newNodeIndex0 = face0.n[farNodeFaceIndex0];
    const oldNodeIndex0 = face0.n[(farNodeFaceIndex0 + 1) % 3];
    const newNodeIndex1 = face1.n[farNodeFaceIndex1];
    const oldNodeIndex1 = face1.n[(farNodeFaceIndex1 + 1) % 3];
    const oldNode0 = mesh.nodes[oldNodeIndex0];
    const oldNode1 = mesh.nodes[oldNodeIndex1];
    const newNode0 = mesh.nodes[newNodeIndex0];
    const newNode1 = mesh.nodes[newNodeIndex1];
    const newEdgeIndex0 = face1.e[(farNodeFaceIndex1 + 2) % 3];
    const newEdgeIndex1 = face0.e[(farNodeFaceIndex0 + 2) % 3];
    const newEdge0 = mesh.edges[newEdgeIndex0];
    const newEdge1 = mesh.edges[newEdgeIndex1];

    if (!predicate(oldNode0, oldNode1, newNode0, newNode1)) return false;

    oldNode0.e.splice(oldNode0.e.indexOf(edgeIndex), 1);
    oldNode1.e.splice(oldNode1.e.indexOf(edgeIndex), 1);
    newNode0.e.push(edgeIndex);
    newNode1.e.push(edgeIndex);

    edge.n[0] = newNodeIndex0;
    edge.n[1] = newNodeIndex1;

    newEdge0.f.splice(newEdge0.f.indexOf(edge.f[1]), 1);
    newEdge1.f.splice(newEdge1.f.indexOf(edge.f[0]), 1);
    newEdge0.f.push(edge.f[0]);
    newEdge1.f.push(edge.f[1]);

    oldNode0.f.splice(oldNode0.f.indexOf(edge.f[1]), 1);
    oldNode1.f.splice(oldNode1.f.indexOf(edge.f[0]), 1);
    newNode0.f.push(edge.f[1]);
    newNode1.f.push(edge.f[0]);

    face0.n[(farNodeFaceIndex0 + 2) % 3] = newNodeIndex1;
    face1.n[(farNodeFaceIndex1 + 2) % 3] = newNodeIndex0;

    face0.e[(farNodeFaceIndex0 + 1) % 3] = newEdgeIndex0;
    face1.e[(farNodeFaceIndex1 + 1) % 3] = newEdgeIndex1;
    face0.e[(farNodeFaceIndex0 + 2) % 3] = edgeIndex;
    face1.e[(farNodeFaceIndex1 + 2) % 3] = edgeIndex;

    return true;
  }

  static getFaceOppositeNodeIndex(face: Mesh['faces'][0], edge: Mesh['edges'][0]) {
    if (face.n[0] !== edge.n[0] && face.n[0] !== edge.n[1]) return 0;
    if (face.n[1] !== edge.n[0] && face.n[1] !== edge.n[1]) return 1;
    if (face.n[2] !== edge.n[0] && face.n[2] !== edge.n[1]) return 2;
    throw 'Cannot find node of given face that is not also a node of given edge.';
  }

  static relaxMesh(mesh: Mesh, multiplier: number) {
    const totalSurfaceArea = 4 * Math.PI;
    const idealFaceArea = totalSurfaceArea / mesh.faces.length;
    const idealEdgeLength = Math.sqrt((idealFaceArea * 4) / Math.sqrt(3));
    const idealDistanceToCentroid = ((idealEdgeLength * Math.sqrt(3)) / 3) * 0.9;

    const pointShifts = mesh.nodes.map((node) => new Vector3(0, 0, 0));

    mesh.faces.forEach((face) => {
      const n0 = mesh.nodes[face.n[0]];
      const n1 = mesh.nodes[face.n[1]];
      const n2 = mesh.nodes[face.n[2]];
      const p0 = n0.p;
      const p1 = n1.p;
      const p2 = n2.p;
      const e0 = p1.distanceTo(p0) / idealEdgeLength;
      const e1 = p2.distanceTo(p1) / idealEdgeLength;
      const e2 = p0.distanceTo(p2) / idealEdgeLength;
      const centroid = PlanetMeshGenerator.calculateFaceCentroid(p0, p1, p2).normalize();
      const v0 = centroid.clone().sub(p0);
      const v1 = centroid.clone().sub(p1);
      const v2 = centroid.clone().sub(p2);
      const length0 = v0.length();
      const length1 = v1.length();
      const length2 = v2.length();
      v0.multiplyScalar((multiplier * (length0 - idealDistanceToCentroid)) / length0);
      v1.multiplyScalar((multiplier * (length1 - idealDistanceToCentroid)) / length1);
      v2.multiplyScalar((multiplier * (length2 - idealDistanceToCentroid)) / length2);
      pointShifts[face.n[0]].add(v0);
      pointShifts[face.n[1]].add(v1);
      pointShifts[face.n[2]].add(v2);
    });

    const origin = new Vector3(0, 0, 0);
    const plane = new Plane();
    mesh.nodes.forEach((node, index) => {
      plane.setFromNormalAndCoplanarPoint(node.p, origin);
      pointShifts[index] = node.p.clone().add(plane.projectPoint(pointShifts[index], new Vector3())).normalize();
    });

    const rotationSupressions = new Array(mesh.nodes.length);
    for (let i = 0; i < mesh.nodes.length; ++i) rotationSupressions[i] = 0;

    mesh.edges.forEach((edge) => {
      const oldPoint0 = mesh.nodes[edge.n[0]].p;
      const oldPoint1 = mesh.nodes[edge.n[1]].p;
      const newPoint0 = pointShifts[edge.n[0]];
      const newPoint1 = pointShifts[edge.n[1]];
      const oldVector = oldPoint1.clone().sub(oldPoint0).normalize();
      const newVector = newPoint1.clone().sub(newPoint0).normalize();
      const suppression = (1 - oldVector.dot(newVector)) * 0.5;
      rotationSupressions[edge.n[0]] = Math.max(rotationSupressions[edge.n[0]], suppression);
      rotationSupressions[edge.n[1]] = Math.max(rotationSupressions[edge.n[1]], suppression);
    });

    let totalShift = 0;
    mesh.nodes.forEach((node, index) => {
      const point = node.p;
      const delta = point.clone();
      point.lerp(pointShifts[index], 1 - Math.sqrt(rotationSupressions[index])).normalize();
      delta.sub(point);
      totalShift += delta.length();
    });

    return totalShift;
  }

  static calculateFaceCentroid(pa: Vector3, pb: Vector3, pc: Vector3) {
    const vabHalf = pb.clone().sub(pa).divideScalar(2);
    const pabHalf = pa.clone().add(vabHalf);
    return pc
      .clone()
      .sub(pabHalf)
      .multiplyScalar(1 / 3)
      .add(pabHalf);
  }
}
