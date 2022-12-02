import { ModelGeneratorOptions, ModelGeneratorHandler } from '../basic-generator';
import { PlanetBiomeGenerator } from './planet-biome-generator';
import { PlanetMeshGenerator } from './planet-mesh-generator';
import { PlanetPartitionGenerator } from './planet-partition-generator';
import { PlanetTerrainGenerator } from './planet-terrain-generator';
import { PlanetTopologyGenerator } from './planet-topology-generator';
import { PlanetSurface } from './utils';

function adjustRange(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

export interface PlanetSurfaceModelGen {}

export interface PlanetSurfaceOptions extends ModelGeneratorOptions {
  subdivisions: number; // [2,20] detail_level
  distortionLevel: number; // [.1,1] - 0 occur visual bugs: empty space // todo: CONST?? --- |
  plateCount: number; // [0,100]
  oceanicRate: number; // [0,1]
  heatLevel: number; // [0,2]
  moistureLevel: number; // [0,2]
  // seed: number;
  strategyName: string;
  byStrategy: boolean;
}

const defaultOptions: PlanetSurfaceOptions = {
  subdivisions: 10,
  distortionLevel: 1,
  plateCount: 7,
  oceanicRate: 70 / 100,
  heatLevel: 1 / 100 + 1,
  moistureLevel: 1 / 100 + 1,
  seed: 19191919,
  strategyName: 'terrestial-earth',
  byStrategy: false,
};

export const surfaceStrategy = [
  {
    name: 'terrestial-earth',
    modyficators: [
      [PlanetTerrainGenerator, { plateCount: 20, subdivisions: 9 }],
      [PlanetBiomeGenerator, { strategy: 'terrestial-earth' }],
    ] as const,
  },
  {
    name: 'terrestial-ocean',
    modyficators: [
      [PlanetTerrainGenerator, { plateCount: 7, subdivisions: 9, oceanicRate: 1, moistureLevel: 1 }],
      [PlanetBiomeGenerator, { strategy: 'terrestial-earth' }],
    ] as const,
  },
  {
    name: 'terrestial-desert',
    modyficators: [
      [PlanetTerrainGenerator, { plateCount: 20, subdivisions: 9, oceanicRate: 0, moistureLevel: 0, heatLevel: 1 }],
      [PlanetBiomeGenerator, { strategy: 'terrestial-earth' }],
    ] as const,
  },
  {
    name: 'terrestial-lava',
    modyficators: [
      [PlanetTerrainGenerator, { plateCount: 20, oceanicRate: 0.7, subdivisions: 9 }],
      [PlanetBiomeGenerator, { strategy: 'terrestial-lava' }],
    ] as const,
  },
  {
    name: 'gas-giant',
    modyficators: [[PlanetBiomeGenerator, { strategy: 'gas-giant' }]] as const,
  },
];

export class PlanetSurfaceGenerator extends ModelGeneratorHandler<PlanetSurfaceModelGen, PlanetSurfaceOptions> {
  // @ts-ignore
  planet: PlanetSurface = {};

  constructor(model: PlanetSurfaceModelGen, options?: Partial<PlanetSurfaceOptions>) {
    super(model, { ...defaultOptions, ...options });
  }

  generateSurface() {
    console.time('all generators');
    const {
      distortionLevel,
      plateCount,
      oceanicRate,
      heatLevel,
      moistureLevel,
      subdivisions,
      strategyName,
      byStrategy,
    } = this.options;

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

    // todo can be deleted?
    // console.time('partition');
    // this.planet.partition = PlanetPartitionGenerator.generatePlanetPartition(this.planet.topology.tiles);
    // console.timeEnd('partition');

    // console.time('terrain');
    // const terrainGenerator = new PlanetTerrainGenerator();
    // terrainGenerator.generate(this.planet, this.random, {
    //   plateCount,
    //   oceanicRate,
    //   heatLevel,
    //   moistureLevel,
    // });
    // console.timeEnd('terrain');

    // console.time('biomes');
    // // 'Generating Biomes'
    // const biomeGenerator = new PlanetBiomeGenerator();
    // biomeGenerator.generate(this.planet, this.random);
    // console.timeEnd('biomes');

    // const strategyName = 'terrestial-earth';
    // const strategyName = 'gas-giant';
    // const strategyName = 'terrestial-lava';
    // strategy
    const strategy = surfaceStrategy.find((strategy) => strategy.name === strategyName);
    strategy?.modyficators.forEach(([Generator, options]) => {
      const generator = new Generator(options);
      generator.generate(this.planet, this.random, byStrategy ? options : { ...options, ...this.options });
      // generator.generate(this.planet, this.random, {...options, ...this.options});
    });

    // end strategy

    console.timeEnd('all generators');
    return this.planet;
  }

  // toModel() {
  //   return { ...this.model };
  // }
}
