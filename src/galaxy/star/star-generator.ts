import { codename, numberToGreekChar } from '../../utils';

import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { StarPhysicModel, StarPhysics, StarStellarClass } from '../physic';

import { StarModel } from './types';

interface StarOptions extends RandomGeneratorOptions {
  name?: string;
  temperature?: number;
}

const defaultOptions: StarOptions = {
  // seed: 999,
};

export class StarGenerator extends RandomGenerator<StarModel, StarOptions> {
  public physic?: StarPhysicModel;
  private meta: typeof StarPhysics.SPECTRAL_CLASSIFICATION[0];

  constructor(model: StarModel, options: Partial<StarOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (model.mass && !model.spectralClass) {
      this.meta = StarPhysics.getSpectralByMass(model.mass);
    } else if (model.spectralClass) {
      this.meta = StarPhysics.getSpectralByClass(model.spectralClass);
      this.model.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    } else {
      this.meta = this.random.choice(StarPhysics.SPECTRAL_CLASSIFICATION);
      this.model.mass = this.random.real(this.meta.min_sol_mass, this.meta.max_sol_mass);
    }
    this.model.spectralClass = this.meta.class;

    this.recalculatePhysic();
  }

  get name() {
    return this.model.name as string; // todo
  }
  get mass() {
    return this.model.mass as number; // todo
  }

  setName(name: string) {
    this.model.name = name;
    this.model.id = codename(name)
  }

  static getSequentialName(systemName: string, starIndex: number) {
    return `${systemName} ${numberToGreekChar(starIndex)}`;
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
      model.stellar_class = this.meta.class;
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
