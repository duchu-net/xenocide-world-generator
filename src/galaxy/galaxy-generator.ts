import { Vector3 } from 'three';

import { ShapeBase, Grid, Spiral } from '../galaxy-shape';
import { galaxyClass, GalaxyClass, Position } from '../interfaces';
import { capitalize, codename } from '../utils';
import { StarName } from '../utils/StarName';

import { RandomGenerator, RandomGeneratorOptions } from './basic-generator';
import { StarPhysics } from './physic';
import { SystemGenerator, SystemModel } from './system';

export interface GalaxyModel {
  id?: string;
  path?: string;
  seedSystems?: number; // todo
  name?: string;
  position?: Position;
  classification?: GalaxyClass;
  systems?: SystemModel[];

  options?: {};
}

export interface GalaxyOptions extends RandomGeneratorOptions {
  grid: { size: number; spacing: number }; // todo
  spiral: { size: number }; // todo
  seedSystems?: number;
}

const defaultOptions: GalaxyOptions = {
  grid: { size: 100, spacing: 30 },
  spiral: { size: 400 },
};

const RegisteredGenerators = {
  spiral: Spiral,
  grid: Grid,
} as const;

export class GalaxyGenerator extends RandomGenerator<GalaxyModel, GalaxyOptions> {
  override schemaName = 'GalaxyModel';
  public readonly systems: SystemGenerator[] = [];
  private galaxyShape: ShapeBase;

  constructor(model: GalaxyModel, options: Partial<GalaxyOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    // todo check that
    this.systems = model.systems?.map((system) => new SystemGenerator(system)) || [];
  }

  public shape(galaxyShape: ShapeBase) {
    this.galaxyShape = galaxyShape;
    return this;
  }
  // ?not working since we throw all options to model - all is already set after reseed
  public reseed(seed: number) {
    this.options.seed = seed;
    this.random = this.random.instance(seed);
    return this;
  }
  private isBuilded = false;
  public build() {
    // Starting seed for systems
    if (!this.options.seedSystems) this.options.seedSystems = this.random.next();
    // Model check
    const { model } = this;
    if (!model.name) model.name = capitalize(StarName.GenerateGalaxyName(this.random)); // todo name generator should be static inside Galaxy?
    if (!model.id) model.id = codename(model.name);
    if (!model.path) model.path = codename(model.name);
    if (!model.position) model.position = new Vector3();

    if (!model.classification && !this.galaxyShape) {
      model.classification = this.random?.choice(Object.values(galaxyClass));
    }
    if (model.classification && !this.galaxyShape) {
      this.galaxyShape = new RegisteredGenerators[model.classification](this.options[model.classification]);
    } else if (this.galaxyShape) {
      model.classification = this.galaxyShape.constructor.name as GalaxyClass;
    }

    this.isBuilded = true;
  }

  *generateSystems() {
    if (!this.isBuilded) this.build();

    const shape = this.galaxyShape;
    const random = this.random.instance(this.options.seedSystems);

    for (const system of shape.Generate(random)) {
      // CHECK UNIQUE SEED
      let systemSeed = random.next();
      while (this.systems.find((system) => system.options.seed == systemSeed)) systemSeed = random.next();
      let systemName = StarName.Generate(random);
      while (
        this.systems.find((system) => {
          return system.model.name?.toLowerCase() == systemName.toLowerCase();
        })
      )
        systemName = StarName.Generate(random);

      const systemGenerator = new SystemGenerator(
        {
          name: systemName,
          parentPath: this.model.path,
          position: system.position,
          temperature: system.temperature, // todo not needed?
        },
        {
          seed: systemSeed,
          spectralClass: StarPhysics.getSpectralByTemperature(system.temperature as number)?.class,
        }
      );
      this.systems.push(systemGenerator);
      yield systemGenerator;
    }
    // this.fillStatistics();
  }

  override toModel(): Required<GalaxyModel> {
    // @ts-ignore
    return { ...this.model, options: this.options, systems: this.systems.map((system) => system.toModel()) };
  }
}
