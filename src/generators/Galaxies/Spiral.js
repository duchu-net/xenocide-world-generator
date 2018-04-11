// import Vector3 from '../../utils/Vector3'
import { Vector3 } from 'three'
import StarSystem from '../StarSystem'
import Sphere from './Sphere'
import Cluster from './Cluster'


class Spiral {
  constructor() {
    this.Size = 750;
    this.Spacing = 5;

    this.MinimumArms = 3;
    this.MaximumArms = 7;

    this.ClusterCountDeviation = 0.35;
    this.ClusterCenterDeviation = 0.2;

    this.MinArmClusterScale = 0.02;
    this.ArmClusterScaleDeviation = 0.02;
    this.MaxArmClusterScale = 0.1;

    this.Swirl = Math.PI * 4;

    this.CenterClusterScale = 0.19;
    this.CenterClusterDensityMean = 0.00005;
    this.CenterClusterDensityDeviation = 0.000005;
    this.CenterClusterSizeDeviation = 0.00125;

    this.CenterClusterCountMean = 20;
    this.CenterClusterCountDeviation = 3;
    this.CenterClusterPositionDeviation = 0.075;

    this.CentralVoidSizeMean = 25;
    this.CentralVoidSizeDeviation = 7;
  }

  * Generate(random) {
    const {
      CentralVoidSizeDeviation,
      CentralVoidSizeMean,
    } = this

    try {
      var centralVoidSize = random.NormallyDistributedSingle(CentralVoidSizeDeviation, CentralVoidSizeMean);
      if (centralVoidSize < 0)
          centralVoidSize = 0;
      var centralVoidSizeSqr = centralVoidSize * centralVoidSize;

      for (const star of this.GenerateArms(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star
      }

      for (const star of this.GenerateCenter(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star
      }

      for (const star of this.GenerateBackgroundStars(random)) {
        if (star.position.lengthSq() > centralVoidSizeSqr) yield star
      }
    } catch(err) {
      console.log('ERR>', err);
    }
  }

  GenerateBackgroundStars(random) {
    const { Size } = this
    return new Sphere(Size, 0.000001, 0.0000001, 0.35, 0.125, 0.35).Generate(random);
  }

  * GenerateArms(random) {
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
    } = this

    try {
      const arms = random.Next(MinimumArms, MaximumArms);
      const armAngle = ((Math.PI * 2) / arms);

      const maxClusters = (Size / Spacing) / arms;
      for (let arm=0; arm<arms; arm++) {
        const clusters = (random.NormallyDistributedSingle(maxClusters * ClusterCountDeviation, maxClusters)).toFixed();
        for (let i=0; i<clusters; i++) {
          //Angle from center of this arm
          const angle = random.NormallyDistributedSingle(0.5 * armAngle * ClusterCenterDeviation, 0) + armAngle * arm;
          //Distance along this arm
          const dist = Math.abs(random.NormallyDistributedSingle(Size * 0.4, 0));
          //Center of the cluster
          const center = new Vector3(0, 0, dist)
          center.applyAxisAngle(new Vector3(0,1,0), angle)
          //const center = Vector3.Transform(new Vector3(0, 0, dist), Quaternion.CreateFromAxisAngle(new Vector3(0, 1, 0), angle));

          //Size of the cluster
          var clsScaleDev = ArmClusterScaleDeviation * Size;
          var clsScaleMin = MinArmClusterScale * Size;
          var clsScaleMax = MaxArmClusterScale * Size;
          var cSize = random.NormallyDistributedSingle(clsScaleDev, clsScaleMin * 0.5 + clsScaleMax * 0.5, clsScaleMin, clsScaleMax);

          const densityMean = 0.00025
          const stars = new Sphere(cSize, densityMean, null, 1, 1, 1).Generate(random);
          for (const star of stars) {
            yield star.Offset(center).Swirl(new Vector3(0,1,0), Swirl)
          }
        }
      }
    } catch(err) {
      console.log('ERR>', err);
    }
  }

  * GenerateCenter(random) {
    const {
      Size,
      Swirl,
      CenterClusterDensityDeviation,
      CenterClusterDensityMean,
      CenterClusterCountMean,
      CenterClusterScale,
      CenterClusterCountDeviation,
      CenterClusterPositionDeviation,
    } = this

    try {
      //Add a single central cluster
      var sphere = new Sphere(
        Size * CenterClusterScale,//size:
        CenterClusterDensityMean,//densityMean:
        CenterClusterDensityDeviation,//densityDeviation:
        CenterClusterScale,//deviationX:
        CenterClusterScale,//deviationY:
        CenterClusterScale//deviationZ:
      );

      var cluster = new Cluster(
        sphere,
        CenterClusterCountMean,
        CenterClusterCountDeviation,
        Size * CenterClusterPositionDeviation,
        Size * CenterClusterPositionDeviation,
        Size * CenterClusterPositionDeviation
      );

      for (var star of cluster.Generate(random)) {
        yield star.Swirl(new Vector3(0, 1, 0), Swirl * 5)
      }
    } catch(err) {
      console.log('!', err);
    }
  }
}

export default Spiral
