import { Sphere, Vector3 } from 'three';
import { IcosahedronBuilder } from './icosahedron-builder';
import { SpatialPartition, Tile } from '../utils';

export class PlanetPartitionBuilder {
  private constructor() {}

  static generatePlanetPartition(tiles: Tile[]) {
    const icosahedron = IcosahedronBuilder.generateIcosahedron();

    icosahedron.faces.forEach((face) => {
      const p0 = icosahedron.nodes[face.n[0]].p.clone().multiplyScalar(1000);
      const p1 = icosahedron.nodes[face.n[1]].p.clone().multiplyScalar(1000);
      const p2 = icosahedron.nodes[face.n[2]].p.clone().multiplyScalar(1000);
      const center = p0.clone().add(p1).add(p2).divideScalar(3);
      const radius = Math.max(center.distanceTo(p0), center.distanceTo(p2), center.distanceTo(p2));
      // @ts-ignore
      face.boundingSphere = new Sphere(center, radius);
      // @ts-ignore
      face.children = [];
    });

    const unparentedTiles: Tile[] = [];
    let maxDistanceFromOrigin = 0;
    tiles.forEach((tile) => {
      maxDistanceFromOrigin = Math.max(
        maxDistanceFromOrigin,
        (tile.boundingSphere as Sphere).center.length() + (tile.boundingSphere as Sphere).radius
      );

      let parentFound = false;
      for (let j = 0; j < icosahedron.faces.length; ++j) {
        const face = icosahedron.faces[j];
        const distance =
          // @ts-ignore
          (tile.boundingSphere as Sphere).center.distanceTo(face.boundingSphere.center) +
          (tile.boundingSphere as Sphere).radius;
        // @ts-ignore
        if (distance < face.boundingSphere.radius) {
          // @ts-ignore
          face.children.push(tile);
          parentFound = true;
          break;
        }
      }
      if (!parentFound) {
        unparentedTiles.push(tile);
      }
    });

    const rootPartition = new SpatialPartition(
      new Sphere(new Vector3(0, 0, 0), maxDistanceFromOrigin),
      [],
      unparentedTiles
    );
    icosahedron.faces.forEach((face) => {
      // @ts-ignore
      rootPartition.partitions.push(new SpatialPartition(face.boundingSphere, [], face.children));
      // @ts-ignore
      delete face.boundingSphere;
      // @ts-ignore
      delete face.children;
    });

    return rootPartition;
  }
}
