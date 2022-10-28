import { Vector3 } from 'three';

import { RandomObject } from '../utils';
import { Names } from '../generators/Names';
import { StarName } from '../generators/StarName';
import { BasicGenerator, BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { GalaxyClass, GalaxyClassShape } from '../interfaces';
import { SystemGenerator } from './system-generator';
import { BasicShape, Grid, Spiral } from '../generators/Galaxies';

export interface GalaxyModel {
  systemsSeed?: number; // todo
  name?: string;
  code?: string;
  position?: Vector3;
  classification?: GalaxyClass;

  options?: {};
}

export interface GalaxyOptions extends BasicGeneratorOptions {
  grid: { size: number; spacing: number }; // todo
  spiral: { size: number }; // todo
}

const defaultOptions: GalaxyOptions = {
  grid: { size: 100, spacing: 30 },
  spiral: { size: 400 },
};

export class GalaxyGenerator extends ExtendedGenerator<GalaxyModel, GalaxyOptions> {
  private readonly systems: any[] = [];

  constructor(model: GalaxyModel, options: Partial<GalaxyOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (!model.name) this.model.name = Names.GenerateGalaxyName(this.random); // todo name generator should be static inside Galaxy?
    if (!model.code)
      this.model.code = `GALAXY.${String(this.model.name).toUpperCase().replace(new RegExp(' ', 'g'), '')}`;
    if (!model.position) this.model.position = new Vector3();

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
      while (this.systems.find((o) => o.seed == systemSeed)) systemSeed = this.random.next();
      let systemName = StarName.Generate(this.random);
      while (
        this.systems.find((o) => {
          return o.name.toLowerCase() == systemName.toLowerCase();
        })
      )
        systemName = StarName.Generate(this.random);

      const systemGenerator = new SystemGenerator(
        {
          name: systemName,
          // seed: systemSeed,
          position: system.position,
          temperature: system.temperature,
        },
        { seed: systemSeed }
      );
      this.systems.push(systemGenerator);
      yield systemGenerator;
    }
    // this.fillStatistics();
  }

  override toModel() {
    return { ...this.model, options: this.options, systems: this.systems.map((system) => system.toModel()) };
  }
}
