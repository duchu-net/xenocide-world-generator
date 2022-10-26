import { Vector3 } from 'three';

import { RandomObject } from '../../utils';

import { Sphere } from './Sphere';
import { Cluster } from './Cluster';

export class Spiral {
  Size = 750;
  Spacing = 5;

  MinimumArms = 3;
  MaximumArms = 7;

  ClusterCountDeviation = 0.35;
  ClusterCenterDeviation = 0.2;

  MinArmClusterScale = 0.02;
  ArmClusterScaleDeviation = 0.02;
  MaxArmClusterScale = 0.1;

  Swirl = Math.PI * 4;

  CenterClusterScale = 0.19;
  CenterClusterDensityMean = 0.00005;
  CenterClusterDensityDeviation = 0.000005;
  CenterClusterSizeDeviation = 0.00125;

  CenterClusterCountMean = 20;
  CenterClusterCountDeviation = 3;
  CenterClusterPositionDeviation = 0.075;

  CentralVoidSizeMean = 25;
  CentralVoidSizeDeviation = 7;

  // * GenerateShape(random) {
  //   return this.Generate(random)
  // }
  *Generate(random: RandomObject) {
    const { CentralVoidSizeDeviation, CentralVoidSizeMean } = this;

    try {
      var centralVoidSize = random.NormallyDistributedSingle(CentralVoidSizeDeviation, CentralVoidSizeMean);
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
    const { Size } = this;
    return new Sphere(Size, 0.000001, 0.0000001, 0.35, 0.125, 0.35).Generate(random);
  }

  *GenerateArms(random: RandomObject) {
    const {
      Size,
      Swirl,
      Spacing,
      MinimumArms,
      MaximumArms,
      ClusterCountDeviation,
      ClusterCenterDeviation,
      ArmClusterScaleDeviation,
      MinArmClusterScale,
      MaxArmClusterScale,
    } = this;

    try {
      const arms = random.integer(MinimumArms, MaximumArms);
      const armAngle = (Math.PI * 2) / arms;

      const maxClusters = Size / Spacing / arms;
      for (let arm = 0; arm < arms; arm++) {
        const clusters = parseInt(
          random.NormallyDistributedSingle(maxClusters * ClusterCountDeviation, maxClusters).toFixed()
        );
        for (let i = 0; i < clusters; i++) {
          //Angle from center of this arm
          const angle = random.NormallyDistributedSingle(0.5 * armAngle * ClusterCenterDeviation, 0) + armAngle * arm;
          //Distance along this arm
          const dist = Math.abs(random.NormallyDistributedSingle(Size * 0.4, 0));
          //Center of the cluster
          const center = new Vector3(0, 0, dist);
          center.applyAxisAngle(new Vector3(0, 1, 0), angle);
          //const center = Vector3.Transform(new Vector3(0, 0, dist), Quaternion.CreateFromAxisAngle(new Vector3(0, 1, 0), angle));

          //Size of the cluster
          const clsScaleDev = ArmClusterScaleDeviation * Size;
          const clsScaleMin = MinArmClusterScale * Size;
          const clsScaleMax = MaxArmClusterScale * Size;
          const cSize = random.NormallyDistributedSingle4(
            clsScaleDev,
            clsScaleMin * 0.5 + clsScaleMax * 0.5,
            clsScaleMin,
            clsScaleMax
          );

          const densityMean = 0.00025;
          const stars = new Sphere(cSize, densityMean, undefined, 1, 1, 1).Generate(random);
          for (const star of stars) {
            yield star.Offset(center).Swirl(new Vector3(0, 1, 0), Swirl);
          }
        }
      }
    } catch (err) {
      console.error('ERR>', err);
    }
  }

  *GenerateCenter(random: RandomObject) {
    const {
      Size,
      Swirl,
      CenterClusterDensityDeviation,
      CenterClusterDensityMean,
      CenterClusterCountMean,
      CenterClusterScale,
      CenterClusterCountDeviation,
      CenterClusterPositionDeviation,
    } = this;

    try {
      //Add a single central cluster
      const sphere = new Sphere(
        Size * CenterClusterScale, //size:
        CenterClusterDensityMean, //densityMean:
        CenterClusterDensityDeviation, //densityDeviation:
        CenterClusterScale, //deviationX:
        CenterClusterScale, //deviationY:
        CenterClusterScale //deviationZ:
      );

      const cluster = new Cluster(
        sphere,
        CenterClusterCountMean,
        CenterClusterCountDeviation,
        Size * CenterClusterPositionDeviation,
        Size * CenterClusterPositionDeviation,
        Size * CenterClusterPositionDeviation
      );

      for (const star of cluster.Generate(random)) {
        yield star.Swirl(new Vector3(0, 1, 0), Swirl * 5);
      }
    } catch (err) {
      console.error('!', err);
    }
  }
}
