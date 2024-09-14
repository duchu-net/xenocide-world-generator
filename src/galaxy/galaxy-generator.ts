import { Vector3 } from 'three';

import { BasicShape, Grid, Spiral } from '../galaxy-shape';
import { GalaxyClass, GalaxyClassShape, Position } from '../interfaces';
import { capitalize, codename } from '../utils';
import { Names } from '../utils/Names';
import { StarName } from '../utils/StarName';

import { RandomGenerator, RandomGeneratorOptions } from './basic-generator';
import { StarPhysics } from './physic';
import { SystemGenerator, SystemModel } from './system';

export interface GalaxyModel {
  id?: string;
  path?: string;
  systemsSeed?: number; // todo
  name?: string;
  position?: Position;
  classification?: GalaxyClass;
  systems?: SystemModel[];

  options?: {};
}

export interface GalaxyOptions extends RandomGeneratorOptions {
  grid: { size: number; spacing: number }; // todo
  spiral: { size: number }; // todo
}

const defaultOptions: GalaxyOptions = {
  grid: { size: 100, spacing: 30 },
  spiral: { size: 400 },
};

export class GalaxyGenerator extends RandomGenerator<GalaxyModel, GalaxyOptions> {
  override schemaName = 'GalaxyModel';
  private readonly systems: SystemGenerator[] = [];

  constructor(model: GalaxyModel, options: Partial<GalaxyOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.name) this.model.name = capitalize(Names.GenerateGalaxyName(this.random)); // todo name generator should be static inside Galaxy?
    if (!model.id) this.model.id = codename(this.model.name);
    if (!model.path) this.model.path = codename(this.model.name);
    if (!model.position) this.model.position = new Vector3();

    // todo check that
    this.systems = model.systems?.map((system) => new SystemGenerator(system)) || [];

    this.setClassification();
  }

  setClassification(classification?: GalaxyClass) {
    if (!this.model.classification) {
      const classificationT = this.random?.choice(Object.values(GalaxyClassShape));
      this.model.classification = classification || classificationT;
    }
  }

  getShape(): BasicShape {
    switch (this.model.classification) {
      case 'spiral':
        return new Spiral(this.options.spiral);
      case 'grid':
      default:
        return new Grid(this.options.grid.size, this.options.grid.spacing);
    }
  }

  *generateSystems() {
    const shape = this.getShape();
    for (const system of shape.Generate(this.random)) {
      // CHECK UNIQUE SEED
      let systemSeed = this.random.next();
      while (this.systems.find((system) => system.options.seed == systemSeed)) systemSeed = this.random.next();
      let systemName = StarName.Generate(this.random);
      while (
        this.systems.find((system) => {
          return system.model.name?.toLowerCase() == systemName.toLowerCase();
        })
      )
        systemName = StarName.Generate(this.random);

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
