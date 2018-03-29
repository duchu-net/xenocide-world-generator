class Spiral {
  Size;
  Spacing;

  MinimumArms;
  MaximumArms;

  ClusterCountDeviation;
  ClusterCenterDeviation;

  MinArmClusterScale;
  ArmClusterScaleDeviation;
  MaxArmClusterScale;

  Swirl;

  CenterClusterScale;
  CenterClusterDensityMean;
  CenterClusterDensityDeviation;
  CenterClusterSizeDeviation;

  CenterClusterPositionDeviation;
  CenterClusterCountDeviation;
  CenterClusterCountMean;

  CentralVoidSizeMean;
  CentralVoidSizeDeviation;

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

        // protected internal override IEnumerable<Star> Generate(Random random)
        // {
        //     var centralVoidSize = random.NormallyDistributedSingle(CentralVoidSizeDeviation, CentralVoidSizeMean);
        //     if (centralVoidSize < 0)
        //         centralVoidSize = 0;
        //     var centralVoidSizeSqr = centralVoidSize * centralVoidSize;
        //
        //     foreach (var star in GenerateArms(random))
        //         if (star.Position.LengthSquared() > centralVoidSizeSqr)
        //             yield return star;
        //
        //     foreach (var star in GenerateCenter(random))
        //         if (star.Position.LengthSquared() > centralVoidSizeSqr)
        //             yield return star;
        //
        //     foreach (var star in GenerateBackgroundStars(random))
        //         if (star.Position.LengthSquared() > centralVoidSizeSqr)
        //             yield return star;
        // }
        //
        // private IEnumerable<Star> GenerateBackgroundStars(Random random)
        // {
        //     return new Sphere(Size, 0.000001f, 0.0000001f, 0.35f, 0.125f, 0.35f).Generate(random);
        // }
        //
        // private IEnumerable<Star> GenerateCenter(Random random)
        // {
        //     //Add a single central cluster
        //     var sphere = new Sphere(
        //         size: Size * CenterClusterScale,
        //         densityMean: CenterClusterDensityMean,
        //         densityDeviation: CenterClusterDensityDeviation,
        //         deviationX: CenterClusterScale,
        //         deviationY: CenterClusterScale,
        //         deviationZ: CenterClusterScale
        //     );
        //
        //     var cluster = new Cluster(sphere,
        //         CenterClusterCountMean, CenterClusterCountDeviation, Size * CenterClusterPositionDeviation, Size * CenterClusterPositionDeviation, Size * CenterClusterPositionDeviation
        //     );
        //
        //     foreach (var star in cluster.Generate(random))
        //         yield return star.Swirl(Vector3.UnitY, Swirl * 5);
        // }
        //
        // private IEnumerable<Star> GenerateArms(Random random)
        // {
        //     int arms = random.Next(MinimumArms, MaximumArms);
        //     float armAngle = (float) ((Math.PI * 2) / arms);
        //
        //     int maxClusters = (Size / Spacing) / arms;
        //     for (int arm = 0; arm < arms; arm++)
        //     {
        //         int clusters = (int) Math.Round(random.NormallyDistributedSingle(maxClusters * ClusterCountDeviation, maxClusters));
        //         for (int i = 0; i < clusters; i++)
        //         {
        //             //Angle from center of this arm
        //             float angle = random.NormallyDistributedSingle(0.5f * armAngle * ClusterCenterDeviation, 0) + armAngle * arm;
        //
        //             //Distance along this arm
        //             float dist = Math.Abs(random.NormallyDistributedSingle(Size * 0.4f, 0));
        //
        //             //Center of the cluster
        //             var center = Vector3.Transform(new Vector3(0, 0, dist), Quaternion.CreateFromAxisAngle(new Vector3(0, 1, 0), angle));
        //
        //             //Size of the cluster
        //             var clsScaleDev = ArmClusterScaleDeviation * Size;
        //             var clsScaleMin = MinArmClusterScale * Size;
        //             var clsScaleMax = MaxArmClusterScale * Size;
        //             var cSize = random.NormallyDistributedSingle(clsScaleDev, clsScaleMin * 0.5f + clsScaleMax * 0.5f, clsScaleMin, clsScaleMax);
        //
        //             var stars = new Sphere(cSize, densityMean: 0.00025f, deviationX: 1, deviationY: 1, deviationZ: 1).Generate(random);
        //             foreach (var star in stars)
        //                 yield return star.Offset(center).Swirl(Vector3.UnitY, Swirl);
        //         }
        //     }
        // }
}


export default Spiral
