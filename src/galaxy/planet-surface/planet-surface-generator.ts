import { BasicGeneratorOptions, ExtendedGenerator } from '../basic-generator';
import { PlanetMeshGenerator } from './planet-mesh-generator';
import { PlanetPartitionGenerator } from './planet-partition-generator';
import { PlanetTerrainGenerator } from './planet-terrain-generator';
import { PlanetTopologyGenerator } from './planet-topology-generator';
import { PlanetSurface } from './utils';

function adjustRange(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

export interface PlanetSurfaceModelGen {}

export interface PlanetSurfaceOptions extends BasicGeneratorOptions {
  subdivisions: number; //detail_level
  distortionLevel: number; // CONST?? --- |
  plateCount: number;
  oceanicRate: number;
  heatLevel: number;
  moistureLevel: number;
  seed: number;
  type: string;
}

const defaultOptions: PlanetSurfaceOptions = {
  subdivisions: 10, //detail_level
  distortionLevel: 100, // CONST?? --- |
  plateCount: 7,
  oceanicRate: 70 / 100,
  heatLevel: 1 / 100 + 1,
  moistureLevel: 1 / 100 + 1,
  seed: 19191919,
  type: 'earth',
};

export class PlanetSurfaceGenerator extends ExtendedGenerator<PlanetSurfaceModelGen, PlanetSurfaceOptions> {
  // @ts-ignore
  planet: PlanetSurface = {};

  constructor(model: PlanetSurfaceModelGen, options?: PlanetSurfaceOptions) {
    super(model, { ...defaultOptions, ...options });
  }

  generateSurface() {
    console.time('all generators');
    const { distortionLevel, plateCount, oceanicRate, heatLevel, moistureLevel, subdivisions } = this.options;

    let distortionRate = null;
    if (distortionLevel < 0.25) distortionRate = adjustRange(distortionLevel, 0.0, 0.25, 0.0, 0.04);
    else if (distortionLevel < 0.5) distortionRate = adjustRange(distortionLevel, 0.25, 0.5, 0.04, 0.05);
    else if (distortionLevel < 0.75) distortionRate = adjustRange(distortionLevel, 0.5, 0.75, 0.05, 0.075);
    else distortionRate = adjustRange(distortionLevel, 0.75, 1.0, 0.075, 0.15);

    console.time('mesh');
    const meshGenerator = new PlanetMeshGenerator();
    this.planet.mesh = meshGenerator.generatePlanetMesh(subdivisions, distortionRate, this.random);
    console.timeEnd('mesh');

    console.time('topology');
    const topologyGenerator = new PlanetTopologyGenerator();
    this.planet.topology = topologyGenerator.generatePlanetTopology(this.planet.mesh);
    console.timeEnd('topology');

    console.time('partition');
    this.planet.partition = PlanetPartitionGenerator.generatePlanetPartition(this.planet.topology.tiles);
    console.timeEnd('partition');

    console.time('terrain');
    const terrainGenerator = new PlanetTerrainGenerator();
    terrainGenerator.generatePlanetTerrain(this.planet, plateCount, oceanicRate, heatLevel, moistureLevel, this.random);
    console.timeEnd('terrain');

    console.timeEnd('all generators');
    return this.planet;
  }

  override toModel() {
    return { ...this.model };
  }
}
