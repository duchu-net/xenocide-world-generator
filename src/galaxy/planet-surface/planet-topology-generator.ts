import * as THREE from 'three';
import { Vector3 } from 'three';

import { Border, Corner, Mesh, Tile, Topology } from './utils';

function calculateTriangleArea(pa: Vector3, pb: Vector3, pc: Vector3) {
  var vab = new THREE.Vector3().subVectors(pb, pa);
  var vac = new THREE.Vector3().subVectors(pc, pa);
  var faceNormal = new THREE.Vector3().crossVectors(vab, vac);
  var vabNormal = new THREE.Vector3().crossVectors(faceNormal, vab).normalize();
  var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(vabNormal, pa);
  var height = plane.distanceToPoint(pc);
  var width = vab.length();
  var area = width * height * 0.5;
  return area;
}

export class PlanetTopologyGenerator {
  maxDistanceToCorner?: number;

  generatePlanetTopology(mesh: Mesh): Topology {
    const corners: Corner[] = mesh.faces.map(
      (face, index) =>
        new Corner(
          index,
          (face.centroid as Vector3).clone().multiplyScalar(1000),
          face.e.length,
          face.e.length,
          face.n.length
        )
    );
    const borders: Border[] = mesh.edges.map((edge, index) => new Border(index, 2, 4, 2));

    const tiles: Tile[] = mesh.nodes.map(
      (node, index) => new Tile(index, node.p.clone().multiplyScalar(1000), node.f.length, node.e.length, node.e.length)
    );

    corners.forEach((corner, index) => {
      const face = mesh.faces[index];
      for (let j = 0; j < face.e.length; ++j) {
        corner.borders[j] = borders[face.e[j]];
      }
      for (let j = 0; j < face.n.length; ++j) {
        corner.tiles[j] = tiles[face.n[j]];
      }
    });

    borders.forEach((border, index) => {
      const edge = mesh.edges[index];
      const averageCorner = new THREE.Vector3(0, 0, 0);
      let n = 0;
      for (let j = 0; j < edge.f.length; ++j) {
        const corner = corners[edge.f[j]];
        averageCorner.add(corner.position);
        border.corners[j] = corner;
        for (var k = 0; k < corner.borders.length; ++k) {
          if (corner.borders[k] !== border) border.borders[n++] = corner.borders[k];
        }
      }
      border.midpoint = averageCorner.multiplyScalar(1 / border.corners.length);
      for (var j = 0; j < edge.n.length; ++j) {
        border.tiles[j] = tiles[edge.n[j]];
      }
    });

    corners.forEach((corner, index) => {
      for (var j = 0; j < corner.borders.length; ++j) {
        corner.corners[j] = corner.borders[j].oppositeCorner(corner);
      }
    });

    tiles.forEach((tile, index) => {
      const node = mesh.nodes[index];
      for (let j = 0; j < node.f.length; ++j) {
        tile.corners[j] = corners[node.f[j]];
      }
      for (let j = 0; j < node.e.length; ++j) {
        const border = borders[node.e[j]];
        if (border.tiles[0] === tile) {
          for (let k = 0; k < tile.corners.length; ++k) {
            const corner0 = tile.corners[k];
            const corner1 = tile.corners[(k + 1) % tile.corners.length];
            if (border.corners[1] === corner0 && border.corners[0] === corner1) {
              border.corners[0] = corner0;
              border.corners[1] = corner1;
            } else if (border.corners[0] !== corner0 || border.corners[1] !== corner1) {
              continue;
            }
            tile.borders[k] = border;
            tile.tiles[k] = border.oppositeTile(tile);
            break;
          }
        } else {
          for (let k = 0; k < tile.corners.length; ++k) {
            const corner0 = tile.corners[k];
            const corner1 = tile.corners[(k + 1) % tile.corners.length];
            if (border.corners[0] === corner0 && border.corners[1] === corner1) {
              border.corners[1] = corner0;
              border.corners[0] = corner1;
            } else if (border.corners[1] !== corner0 || border.corners[0] !== corner1) {
              continue;
            }
            tile.borders[k] = border;
            tile.tiles[k] = border.oppositeTile(tile);
            break;
          }
        }
      }
      tile.averagePosition = new THREE.Vector3(0, 0, 0);
      for (let j = 0; j < tile.corners.length; ++j) {
        tile.averagePosition.add(tile.corners[j].position);
      }
      tile.averagePosition.multiplyScalar(1 / tile.corners.length);
      let maxDistanceToCorner = 0;
      for (let j = 0; j < tile.corners.length; ++j) {
        maxDistanceToCorner = Math.max(maxDistanceToCorner, tile.corners[j].position.distanceTo(tile.averagePosition));
      }
      let area = 0;
      for (let j = 0; j < tile.borders.length; ++j) {
        area += calculateTriangleArea(
          tile.position,
          tile.borders[j].corners[0].position,
          tile.borders[j].corners[1].position
        );
      }
      tile.area = area;
      tile.normal = tile.position.clone().normalize();
      this.maxDistanceToCorner = maxDistanceToCorner;
      tile.boundingSphere = new THREE.Sphere(tile.averagePosition, maxDistanceToCorner);
    });

    corners.forEach((corner) => {
      corner.area = 0;
      for (var j = 0; j < corner.tiles.length; ++j) {
        corner.area += (corner.tiles[j].area as number) / corner.tiles[j].corners.length;
      }
    });

    return { corners, borders, tiles };
  }
}
