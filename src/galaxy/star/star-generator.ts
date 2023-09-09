import { codename, GREEK_LETTERS_NAMES, numberToGreekChar } from '../../utils';

import { RandomGenerator, RandomGeneratorOptions } from '../basic-generator';
import { StarPhysicModel, StarPhysics, StarStellarClass, StarStellarClassData } from '../physic';

import { StarModel } from './types';

type Constant<T> = () => T;
type ConstantValue = <T extends any>(x: T) => Constant<T>;
const constant: ConstantValue = (x) => () => x;

interface StarOptions extends RandomGeneratorOptions {
  // name?: string;
  // temperature?: number;
}

const defaultOptions: StarOptions = {
  // seed: 999,
};

const getSequentialName = (systemName: string, starIndex: number, standarize = false) =>
  `${systemName} ${standarize ? GREEK_LETTERS_NAMES[starIndex] : numberToGreekChar(starIndex)}`;

export class StarGenerator extends RandomGenerator<StarModel, StarOptions> {
  public physic: StarPhysicModel;
  private meta: StarStellarClassData;

  constructor(model: StarModel, options: Partial<StarOptions> = defaultOptions) {
    super(model, { ...defaultOptions, ...model.options, ...options });

    if (model.name && !model.id) this.name(model.name);

    const { spectralClass } = model;
    let { mass } = model;
    if (!mass) {
      const meta = spectralClass
        ? StarPhysics.getSpectralByClass(spectralClass)
        : this.random.choice(StarPhysics.SPECTRAL_CLASSIFICATION);
      mass = this.random.real(meta.min_sol_mass, meta.max_sol_mass);
    }
    this.mass(mass);
  }

  // initialize() {}
  // /** mass accessor function */
  // _mass = constant(1);
  // // mass(value?: number | Constant<number>) {
  // mass(): () => number;
  // mass(value: number | (() => number)): this;
  // mass(value?: number | (() => number)) {
  //   return value !== undefined
  //     ? ((this._mass = typeof value === 'function' ? value : constant(value)), this.initialize(), this)
  //     : this._mass;
  // }

  /** Get Star mass */
  mass(): number;
  /** Set Star mass */
  mass(mass: number): this;
  mass(value?: number) {
    return value !== undefined ? (this.initializePhysic(value), this) : this.model.mass;
    // return value !== undefined ? ((this.model.mass = value), this.initializePhysic(value), this) : this.model.mass;
  }

  /** Get Star name */
  name(): string;
  /** Set Star name */
  name(starName: string): this;
  /** Set Star name based on System name and Star sequence */
  name(systemName: string, sequenceIndex: number): this;
  name(value?: string, sequenceIndex?: number) {
    return value !== undefined ? (this.initializeNaming(value, sequenceIndex), this) : this.model.name;
  }

  private initializeNaming(initialName: string, sequenceIndex?: number) {
    let id = initialName;
    let name = initialName;
    if (sequenceIndex !== undefined) {
      id = getSequentialName(initialName, sequenceIndex, true);
      name = getSequentialName(initialName, sequenceIndex);
    }
    this.model.id = codename(id);
    this.model.name = name;
    this.model.path = `${this.model.parentPath}/s:${this.model.id}`;
  }

  private initializePhysic(mass: number) {
    this.meta = StarPhysics.getSpectralByMass(mass);
    this.model.mass = mass;
    this.model.spectralClass = this.meta.class;

    const model = { mass } as StarPhysicModel;

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

  override toModel() {
    return { ...this.model, physic: this.physic, meta: this.meta };
  }

  static sortByMass(stars: StarGenerator[]) {
    return stars.sort((a, b) => b.mass() - a.mass());
  }
}
