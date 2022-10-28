import { Vector3 } from 'three';
import { SPECTRAL_CLASSIFICATION, STAR_COUNT_DISTIBUTION_IN_SYSTEMS, SUN_TEMPERATURE } from '../interfaces';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions } from './basic-generator';
import { getStarColor } from '../generators/utils/StarColor';
import { StarPhysicModel, StarPhysics } from './physic';

export interface NewStarGeneratorOptions extends BasicGeneratorOptions {
  mass?: number;
  name?: string;
  temperature?: number;
}

const defaultOptions: NewStarGeneratorOptions = {
  // seed: 999,
};

export class NewStarGenerator extends BasicGenerator<NewStarGeneratorOptions> {
  public physic?: StarPhysicModel;
  private meta: typeof SPECTRAL_CLASSIFICATION[0];

  constructor(options: Partial<NewStarGeneratorOptions> = defaultOptions) {
    super({ ...defaultOptions, ...options });

    this.meta = this.random.choice(SPECTRAL_CLASSIFICATION);
    if (!options.mass) {
      this.options.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    }

    this.recalculatePhysic();
  }

  get name(): string {
    return this.options.name || 'star_1'; // todo
  }
  get mass(): number {
    return this.options.mass as number; // todo
  }

  static getName(systemName: string, currentIndex: number) {
    return `${systemName} ${currentIndex + 1}`; // todo somewhere we have that
  }

  recalculatePhysic() {
    const { mass } = this.options;
    if (mass) {
      // @ts-ignore
      const model: StarPhysicModel = { mass };

      model.subtype = this.meta.class;
      model.evolution = this.meta.organisms_evolution;

      model.radius = StarPhysics.calcRadius(model.mass);
      model.volume = StarPhysics.calcVolume(model.radius);
      model.density = StarPhysics.calcDensity(model.mass, model.radius);
      model.luminosity = StarPhysics.calcLuminosity(model.mass);
      model.inner_limit = StarPhysics.calcInnerLimit(model.mass);
      model.outer_limit = StarPhysics.calcOuterLimit(model.mass);
      model.frost_line = StarPhysics.calcFrostLine(model.luminosity);
      model.temperature = StarPhysics.calcTemperature(model.luminosity, model.radius);
      model.color = StarPhysics.calcColor(model.temperature);
      model.surface_area = StarPhysics.calcSurfaceArea(model.radius);
      model.circumference = StarPhysics.calcCircumference(model.radius);
      model.main_sequence_lifetime = StarPhysics.calcMainSequenceLifetime(model.mass, model.luminosity);
      model.habitable_zone = StarPhysics.calcHabitableZone(model.luminosity);
      model.habitable_zone_inner = StarPhysics.calcHabitableZoneStart(model.luminosity);
      model.habitable_zone_outer = StarPhysics.calcHabitableZoneEnd(model.luminosity);

      this.physic = model;
    }
  }
}
