import { Vector3 } from 'three';

import { Names } from '../utils/Names';
import { StarName } from '../utils/StarName';
import { GalaxyClass, GalaxyClassShape } from '../interfaces';
import { BasicShape, Grid, Spiral } from '../galaxy-shape';

import { RandomGenerator, RandomGeneratorOptions } from './basic-generator';
import { StarPhysics } from './physic';
import { SystemGenerator, SystemModel } from './system';

export interface GalaxyModel {
  systemsSeed?: number; // todo
  name?: string;
  code?: string;
  position?: Vector3;
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
  private readonly systems: SystemGenerator[] = [];

  constructor(model: GalaxyModel, options: Partial<GalaxyOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.name) this.model.name = Names.GenerateGalaxyName(this.random); // todo name generator should be static inside Galaxy?
    if (!model.code)
      this.model.code = `GALAXY.${String(this.model.name).toUpperCase().replace(new RegExp(' ', 'g'), '')}`;
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
    for (let system of shape.Generate(this.random)) {
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
          // seed: systemSeed,
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

  override toModel(): GalaxyModel {
    return { ...this.model, options: this.options, systems: this.systems.map((system) => system.toModel()) };
  }
}
