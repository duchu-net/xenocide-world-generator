import { Vector3 } from 'three';

import { RandomObject } from '../utils';

import { Sphere } from './Sphere';
import { Cluster } from './Cluster';
import { BasicShape } from './BasicShape';

interface SpiralShapeOptions {
  size: number;
  swirl: number;
  spacing: number;
  minimumArms: number;
  maximumArms: number;
  clusterCountDeviation: number;
  clusterCenterDeviation: number;
  minArmClusterScale: number;
  armClusterScaleDeviation: number;
  maxArmClusterScale: number;
  centerClusterScale: number;
  centerClusterDensityMean: number;
  centerClusterDensityDeviation: number;
  centerClusterSizeDeviation: number;
  centerClusterCountMean: number;
  centerClusterCountDeviation: number;
  centerClusterPositionDeviation: number;
  centralVoidSizeMean: number;
  centralVoidSizeDeviation: number;
}

const defaultOptions: SpiralShapeOptions = {
  size: 750,
  swirl: Math.PI * 4,
  spacing: 5,
  minimumArms: 3,
  maximumArms: 7,
  clusterCountDeviation: 0.35,
  clusterCenterDeviation: 0.2,
  minArmClusterScale: 0.02,
  armClusterScaleDeviation: 0.02,
  maxArmClusterScale: 0.1,
  centerClusterScale: 0.19,
  centerClusterDensityMean: 0.00005,
  centerClusterDensityDeviation: 0.000005,
  centerClusterSizeDeviation: 0.00125,
  centerClusterCountMean: 20,
  centerClusterCountDeviation: 3,
  centerClusterPositionDeviation: 0.075,
  centralVoidSizeMean: 25,
  centralVoidSizeDeviation: 7,
};

export class Spiral implements BasicShape {
  public readonly options: SpiralShapeOptions;
  constructor(options: Partial<SpiralShapeOptions> = defaultOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  // * GenerateShape(random) {
  //   return this.Generate(random)
  // }
  *Generate(random: RandomObject) {
    const { centralVoidSizeDeviation, centralVoidSizeMean } = this.options;

    try {
      var centralVoidSize = random.NormallyDistributedSingle(centralVoidSizeDeviation, centralVoidSizeMean);
      if (centralVoidSize < 0) centralVoidSize = 0;
      var centralVoidSizeSqr = centralVoidSize * centralVoidSize;

      for (const star of this.GenerateArms(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star;
      }

      for (const star of this.GenerateCenter(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star;
      }

      for (const star of this.GenerateBackgroundStars(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star;
      }
    } catch (err) {
      console.error('ERR>', err);
    }
  }

  GenerateBackgroundStars(random: RandomObject) {
    const { size } = this.options;
    return new Sphere(size, 0.000001, 0.0000001, 0.35, 0.125, 0.35).Generate(random);
  }

  *GenerateArms(random: RandomObject) {
    const {
      size,
      swirl,
      spacing,
      minimumArms,
      maximumArms,
      clusterCountDeviation,
      clusterCenterDeviation,
      armClusterScaleDeviation,
      minArmClusterScale,
      maxArmClusterScale,
    } = this.options;

    try {
      const arms = random.integer(minimumArms, maximumArms);
      const armAngle = (Math.PI * 2) / arms;

      const maxClusters = size / spacing / arms;
      for (let arm = 0; arm < arms; arm++) {
        const clusters = parseInt(
          random.NormallyDistributedSingle(maxClusters * clusterCountDeviation, maxClusters).toFixed()
        );
        for (let i = 0; i < clusters; i++) {
          //Angle from center of this arm
          const angle = random.NormallyDistributedSingle(0.5 * armAngle * clusterCenterDeviation, 0) + armAngle * arm;
          //Distance along this arm
          const dist = Math.abs(random.NormallyDistributedSingle(size * 0.4, 0));
          //Center of the cluster
          const center = new Vector3(0, 0, dist);
          center.applyAxisAngle(new Vector3(0, 1, 0), angle);
          //const center = Vector3.Transform(new Vector3(0, 0, dist), Quaternion.CreateFromAxisAngle(new Vector3(0, 1, 0), angle));

          //size of the cluster
          const clsScaleDev = armClusterScaleDeviation * size;
          const clsScaleMin = minArmClusterScale * size;
          const clsScaleMax = maxArmClusterScale * size;
          const cSize = random.NormallyDistributedSingle4(
            clsScaleDev,
            clsScaleMin * 0.5 + clsScaleMax * 0.5,
            clsScaleMin,
            clsScaleMax
          );

          const densityMean = 0.00025;
          const stars = new Sphere(cSize, densityMean, undefined, 1, 1, 1).Generate(random);
          for (const star of stars) {
            yield star.Offset(center).swirl(new Vector3(0, 1, 0), swirl);
          }
        }
      }
    } catch (err) {
      console.error('ERR>', err);
    }
  }

  *GenerateCenter(random: RandomObject) {
    const {
      size,
      swirl,
      centerClusterDensityDeviation,
      centerClusterDensityMean,
      centerClusterCountMean,
      centerClusterScale,
      centerClusterCountDeviation,
      centerClusterPositionDeviation,
    } = this.options;

    try {
      //Add a single central cluster
      const sphere = new Sphere(
        size * centerClusterScale, //size:
        centerClusterDensityMean, //densityMean:
        centerClusterDensityDeviation, //densityDeviation:
        centerClusterScale, //deviationX:
        centerClusterScale, //deviationY:
        centerClusterScale //deviationZ:
      );

      const cluster = new Cluster(
        sphere,
        centerClusterCountMean,
        centerClusterCountDeviation,
        size * centerClusterPositionDeviation,
        size * centerClusterPositionDeviation,
        size * centerClusterPositionDeviation
      );

      for (const star of cluster.Generate(random)) {
        yield star.swirl(new Vector3(0, 1, 0), swirl * 5);
      }
    } catch (err) {
      console.error('!', err);
    }
  }
}
