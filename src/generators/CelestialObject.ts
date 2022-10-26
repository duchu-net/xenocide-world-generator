import { RandomObject, Seed } from '../utils';

export interface CelestialModel {
  id?: string;
  seed?: number;
  type?: string;
  designation?: string;
  extends?: {};
  parent?: {};
  system?: {};
}

export abstract class CelestialObject {
  static id = 0;

  private readonly id?: string;
  private seed?: Seed;
  private random?: RandomObject;

  name?: string | null = null;
  type?: string | null = null; // ONE OF [STAR,PLANET,SATELLITE,ASTEROID_BELT,MANMADE]
  parent = null;
  parent_id = null;
  code?: string | null = null; // eg. TAU.PLANETS.TAUI, TAU.STARS.TAU, TAU.STARS.TAUA
  designation?: string | null = null;
  orbit_period = null;
  rotation_period = null;
  habitable = null;
  age = null;
  appearance = 'DEFAULT'; // wygląd
  size = null;
  // @ts-ignore
  system: { name: string };

  constructor(props: CelestialModel = {}, type: string) {
    Object.assign(this, props, props.extends || {}); // todo remove
    this.id = props.id;

    this.setSeed(props.seed);
    this.setId(props.id);
    this.setType(props.type || type);
    this.setParent(props.parent);
    this.setSystem(props.system);
    // this.setName(props.name)
    this.setDesignation(props.designation);
  }

  setSeed(seed?: Seed) {
    this.seed = seed || Date.now();
    this.random = new RandomObject(this.seed);
  }

  setType(type: string) {
    this.type = type;
  }

  setId(id?: string) {
    // todo remove setter?
    // @ts-ignore
    this.id = id != null ? id : CelestialObject.getCurrentId();
  }

  setSystem(system: any) {
    this.system = system;
    this.makeCode();
  }

  setName(name: string) {
    this.name = name;
    this.makeCode();
  }

  setDesignation(designation?: string) {
    this.designation = designation;
    this.makeCode();
  }

  setParent(parent: any) {
    if (parent) {
      this.parent = parent;
      this.parent_id = parent.id || null;
    }
  }

  makeCode() {
    // console.log(this.system.name);
    const star_system_name = this.system && this.system.name ? this.escapeRegExp(this.system.name) : '';
    const type = this.type;
    const designation = this.designation ? this.escapeRegExp(this.designation) : '';
    const name = this.name ? this.escapeRegExp(this.name) : '';
    this.code = `${star_system_name}.${type}.${designation}${name}`.toUpperCase().replace(/ /g, '');
  }
  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, ''); // $& means the whole matched string
  }

  static getCurrentId() {
    return CelestialObject.id++;
  }

  abstract toModel(): CelestialModel;
  toJSON() {
    return this.toModel();
  }
}

export default CelestialObject;
