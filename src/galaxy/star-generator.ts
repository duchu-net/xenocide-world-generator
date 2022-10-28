import { Vector3 } from 'three';
import { SPECTRAL_CLASSIFICATION, STAR_COUNT_DISTIBUTION_IN_SYSTEMS } from '../interfaces';
import { RandomObject } from '../utils';
import { BasicGenerator, BasicGeneratorOptions, ExtendedGenerator } from './basic-generator';
import { StarPhysicModel, StarPhysics } from './physic';

export interface StarModel {
  mass?: number;
  name?: string;
  physic?: StarPhysicModel;
  options?: {};
}

export interface StarOptions extends BasicGeneratorOptions {
  name?: string;
  temperature?: number;
}

const defaultOptions: StarOptions = {
  // seed: 999,
};

export class StarGenerator extends ExtendedGenerator<StarModel, StarOptions> {
  public physic?: StarPhysicModel;
  private meta: typeof SPECTRAL_CLASSIFICATION[0];

  constructor(model: StarModel, options: Partial<StarOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    this.meta = this.random.choice(SPECTRAL_CLASSIFICATION);
    this.physic = model.physic;
    if (!model.mass) {
      this.model.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    }

    this.recalculatePhysic();
  }

  get name(): string {
    return this.model.name || 'star_1'; // todo
  }
  get mass(): number {
    return this.model.mass as number; // todo
  }

  setName(name: string) {
    this.model.name = name;
  }

  static getSequentialName(systemName: string, starIndex: number) {
    return `${systemName} ${starIndex + 1}`; // todo toGreekLetter(starIndex + 1)
  }
  static sortByMass(stars: StarGenerator[]) {
    return stars.sort((a, b) => b.mass - a.mass);
  }

  recalculatePhysic() {
    const { mass } = this.model;
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

  override toModel() {
    return { ...this.model, physic: this.physic, meta: this.meta };
  }
}
