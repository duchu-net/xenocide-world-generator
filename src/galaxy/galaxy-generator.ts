import { Vector3 } from 'three';

import { RandomObject } from '../utils';
import { Names } from '../generators/Names';
import { StarName } from '../generators/StarName';
import { BasicGenerator, BasicGeneratorOptions } from './basic-generator';
import { GalaxyClass, GalaxyClassShape } from '../interfaces';
import { NewSystemGenerator } from './system-generator';
import { Grid, Spiral } from '../generators/Galaxies';

export interface NewGalaxyGeneratorOptions extends BasicGeneratorOptions {
  systemsSeed?: number; // todo

  name?: string;
  code?: string;
  position: Vector3;
  classification: GalaxyClass;
  grid: { size: number; spacing: number }; // todo
  spiral: { size: number }; // todo
}

const defaultOptions: NewGalaxyGeneratorOptions = {
  grid: { size: 100, spacing: 30 },
  spiral: { size: 400 },
  position: new Vector3(0, 0, 0),
  classification: GalaxyClass.Grid, // todo remove default
};

export class NewGalaxyGenerator extends BasicGenerator<NewGalaxyGeneratorOptions> {
  private readonly systems: any[] = [];

  constructor(options: Partial<NewGalaxyGeneratorOptions> = defaultOptions) {
    super({ ...defaultOptions, ...options });

    if (!options.name) this.options.name = Names.GenerateGalaxyName(this.random); // todo name generator should be static inside Galaxy?
    if (!options.code)
      this.options.code = `GALAXY.${String(this.options.name).toUpperCase().replace(new RegExp(' ', 'g'), '')}`;

    this.setClassification();
  }

  setClassification(classification?: GalaxyClass) {
    const classificationT = this.random?.choice(Object.values(GalaxyClassShape));
    if (!this.options.classification) this.options.classification = classification || classificationT;
  }

  getShape() {
    let shape = null;
    switch (this.options.classification) {
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

      const systemGenerator = new NewSystemGenerator({
        name: systemName,
        seed: systemSeed,
        position: system.position,
        temperature: system.temperature,
      });
      this.systems.push(systemGenerator);
      yield systemGenerator;
    }
    // this.fillStatistics();
  }
}
