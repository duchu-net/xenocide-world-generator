interface RegionModel {
  biome: string;
}

export abstract class SurfaceStrategy {
  abstract doAlgorithm(regions: RegionModel[]): RegionModel[];
}

class BarrenSurfaceStrategy implements SurfaceStrategy {
  public doAlgorithm(regions: RegionModel[]): RegionModel[] {
    // @ts-ignore
    regions.forEach((region) => (region.biome = 'barren'));
    return regions;
  }
}

class LavaSurfaceStrategy implements SurfaceStrategy {
  public doAlgorithm(regions: RegionModel[]): RegionModel[] {
    // @ts-ignore
    regions.forEach((region) => (region.biome = 'lava'));
    return regions;
  }
}

class EarthSurfaceStrategy implements SurfaceStrategy {
  public doAlgorithm(regions: RegionModel[]): RegionModel[] {
    // @ts-ignore
    regions.forEach((region) => (region.biome = 'forest'));
    return regions;
  }
}

export const SurfaceStrategies: { [key: string]: SurfaceStrategy } = {
  lava: new LavaSurfaceStrategy(),
  earth: new EarthSurfaceStrategy(),
  barren: new BarrenSurfaceStrategy(),
};
